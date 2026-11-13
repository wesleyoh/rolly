#!/usr/bin/env bash
# 맥에서 실행:  ./scripts/build-release.sh          (둘 다)
#              ./scripts/build-release.sh ios      (IPA만)
#              ./scripts/build-release.sh android  (AAB만)
# 결과물: release/rolly-<버전>.ipa, release/rolly-<버전>.aab
#
# 처음 한 번, 저장소 루트에 .env.local 파일을 만들어 두세요 (git에 안 올라감):
#   TEAM_ID=ABCDE12345
#   ANDROID_KEYSTORE_PATH=/Users/me/keys/rolly-upload.jks
#   ANDROID_KEYSTORE_PASSWORD=...
#   ANDROID_KEY_ALIAS=rolly
#   ANDROID_KEY_PASSWORD=...
#   BUILD_NUMBER=2          # 스토어에 올릴 때마다 1씩 올리기
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env.local ] && set -a && . ./.env.local && set +a
TARGET="${1:-all}"
BUILD_NUMBER="${BUILD_NUMBER:-1}"
VERSION="$(node -p "require('./package.json').version")"
OUT=release; mkdir -p "$OUT" build

npm ci
npx cap sync

if [ "$TARGET" = all ] || [ "$TARGET" = android ]; then
  echo "▶ Android AAB"
  : "${ANDROID_KEYSTORE_PATH:?.env.local에 ANDROID_KEYSTORE_PATH가 필요해요}"
  export ANDROID_KEYSTORE_PATH ANDROID_KEYSTORE_PASSWORD ANDROID_KEY_ALIAS ANDROID_KEY_PASSWORD
  ( cd android && VERSION_CODE="$BUILD_NUMBER" ./gradlew bundleRelease )
  cp android/app/build/outputs/bundle/release/app-release.aab "$OUT/rolly-$VERSION-$BUILD_NUMBER.aab"
fi

if [ "$TARGET" = all ] || [ "$TARGET" = ios ]; then
  echo "▶ iOS IPA"
  : "${TEAM_ID:?.env.local에 TEAM_ID가 필요해요}"
  rm -rf build/App.xcarchive build/ipa
  xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release \
    -destination 'generic/platform=iOS' -archivePath build/App.xcarchive \
    -allowProvisioningUpdates DEVELOPMENT_TEAM="$TEAM_ID" CODE_SIGN_STYLE=Automatic \
    CURRENT_PROJECT_VERSION="$BUILD_NUMBER" archive
  cat > build/ExportOptions.plist <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
  <key>method</key><string>app-store-connect</string>
  <key>destination</key><string>export</string>
  <key>teamID</key><string>$TEAM_ID</string>
  <key>signingStyle</key><string>automatic</string>
</dict></plist>
PLIST
  xcodebuild -exportArchive -archivePath build/App.xcarchive \
    -exportOptionsPlist build/ExportOptions.plist -exportPath build/ipa -allowProvisioningUpdates
  cp build/ipa/*.ipa "$OUT/rolly-$VERSION-$BUILD_NUMBER.ipa"
fi

echo "✅ 완료: $(pwd)/$OUT"; ls -la "$OUT"
open "$OUT" 2>/dev/null || true
