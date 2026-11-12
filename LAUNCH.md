# Rolly / 또르르 / コロリン: 출시 플랜

## 1. 게임 한 줄 요약
공(마스코트 "또르") 밑에 **선을 하나만** 그어서 컵에 굴려 넣는 물리 퍼즐.
**오늘의 문제 3개**는 전 세계 모두에게 똑같이 나와서 결과를 공유하게 만드는 역할을 하고, **스테이지 모드**는 매일 계속 플레이하게 만드는 역할을 해요.

## 2. 이름과 스토어 문구 (언어별)
| | 앱 이름 (30자 이내) | 부제 (30자 이내) |
|---|---|---|
| 영어 (미국 외 기본) | Rolly: Draw & Roll Puzzle | One line. One cup. Daily. |
| 한국어 | 또르르: 선 그려 굴리기 | 하루 3문제, 선 하나로 풀기 |
| 일본어 | コロリン：線をひいてころがそう | 毎日3問、一本線パズル |

- 번들 ID: `com.rollygame.oneline` (다른 걸 원하면 알려주세요)
- 카테고리: 게임 > 퍼즐 (보조: 게임 > 캐주얼)
- 연령 등급: 4+ (애드몹 광고 포함)

**키워드 (100자)**
- EN: `draw,line,physics,puzzle,brain,ball,roll,daily,doodle,logic,casual,relaxing,cup,offline,teaser`
- KO: `퍼즐,물리,선긋기,두뇌,공굴리기,낙서,캐주얼,오프라인,데일리,머리쓰는게임,힐링,브레인`
- JA: `パズル,物理,線,お絵かき,脳トレ,ボール,カジュアル,オフライン,毎日,ひまつぶし`

**설명 (EN, 다른 언어는 이걸 번역해서 씀)**
> Draw one line. Roll Rolly into the cup.
> • 3 new daily puzzles: the same for everyone in the world. Compare stars with friends!
> • 100+ stages across 5 worlds, plus Endless Notes
> • Springs, warp holes, moving rulers and spiky chestnuts
> • Earn up to 3 stars: clear it, grab the candy, save ink
> • Unlock cute skins and pens
> • Plays offline. No account needed.

스크린샷: `store/screens/{en,ko,ja}_1~5.png` (6.9인치, 1320×2868)

## 3. 진행 구조와 보상
- **월드 5개 × 20스테이지 + 끝없는 "무한 노트"**
  - 월드마다 새 장치가 하나씩 등장해요: 기본 → 밤송이(가시) → 스프링 → 움직이는 자 → 순간이동
- **별 3개 기준**
  - 깨면 1개
  - 별사탕을 먹으면 +1개
  - 잉크를 기준선(빨간 표시) 이하로 쓰면 +1개
- **다음 월드 열기:** 이전 월드를 끝까지 깨고 별을 30×월드 번호만큼 모으기
  - 별이 부족하면 예전 스테이지로 돌아가서 다시 하게 돼요 (플레이 시간 증가)
- **스킨 7종, 펜 5종:** 별 개수, 연속 출석, 오늘의 문제 클리어 횟수로 열려요
- **힌트(정답 선을 점선으로 보여줌)**
  - 처음에 3개 지급
  - 오늘의 문제를 다 풀면 +1
  - 월드를 깨면 +2
  - 힌트가 없으면 보상형 광고를 보고 +1

## 4. 수익화 (애드몹)
| 단계 | 내용 |
|---|---|
| v1.0 (지금) | **보상형 광고:** 힌트 +1.<br>**전면 광고:** 8번째 스테이지 이후부터, 스테이지 3개 클리어마다 1번, 최소 150초 간격.<br>오늘의 문제에는 광고 없음. |
| v1.1 | 인앱결제: **광고 제거 ₩4,400 / $2.99**, **힌트 10개 ₩1,500**, 스킨 묶음 |
| v1.2 | 연속 출석이 끊겼을 때 광고를 보고 복구하기 |

원칙: 초반 경험과 공유 루프(오늘의 문제)에는 절대 광고를 넣지 않아요. 앱 평점과 리텐션이 곧 순위이기 때문이에요.

### 애드몹 셋업 (해주실 일)
1. admob.google.com에서 앱 2개 추가: iOS, Android (아직 스토어에 없다고 선택)
2. 앱마다 광고 단위 2개 만들기: **보상형**, **전면**
3. 아래 6개 ID를 저한테 알려주세요. 제가 코드의 테스트 ID를 실제 ID로 교체할게요.
   - 앱 ID 2개
   - 광고 단위 ID 4개
4. 개인정보 처리방침 페이지: `docs/privacy.html` (GitHub Pages로 공개)
5. 출시 후 `app-ads.txt` 등록 (방법은 그때 안내할게요)

## 5. 빌드와 배포: Mac 없이 GitHub에서
`.github/workflows/ios-testflight.yml` 파일이 GitHub의 Mac 서버에서 빌드하고 TestFlight에 올려줘요.

GitHub 저장소의 **Settings → Secrets and variables → Actions**에 다음 4개를 넣어주세요.
| 이름 | 값을 찾는 곳 |
|---|---|
| `APPLE_TEAM_ID` | developer.apple.com → Membership → Team ID |
| `ASC_KEY_ID` | App Store Connect → 사용자 및 액세스 → 통합 → App Store Connect API → 키 생성 (**권한: 관리자**) |
| `ASC_ISSUER_ID` | 위와 같은 페이지 위쪽의 Issuer ID |
| `ASC_KEY_P8` | 키를 만들 때 받은 `.p8` 파일을 메모장으로 열어서 내용 전체를 붙여넣기 |

그다음 순서:
1. App Store Connect에서 새 앱을 만들 때 번들 ID `com.rollygame.oneline`으로 등록
   - developer.apple.com → Identifiers에서 먼저 만들어야 할 수도 있어요
2. GitHub → Actions → "iOS → TestFlight" → **Run workflow**
3. 20~30분 뒤 TestFlight에 빌드가 올라오면 폰에서 테스트 → 심사 제출

## 6. 홍보 플랜
**출시 2주 전부터 숏폼 (TikTok, Reels, Shorts) 하루 1개**
- 형식: "Only 1% can solve this with ONE line"
  1. 문제 화면 2초
  2. 실패 3번 (또르가 "앗!" 하는 장면)
  3. 마지막에 성공
- 9:16 화면 녹화에 효과음은 그대로 쓰고, 마지막 프레임에 "Rolly, daily puzzle" 표시
- 해시태그: #puzzle #brainteaser #satisfying #physicsgame

**출시일**
- Reddit r/puzzles, r/WebGames(웹 버전 링크), r/iosgaming, r/AndroidGaming에 "I made a daily one-line physics puzzle" 글 올리기
- 한국: 에펨, 더쿠, 디시 모바일게임 갤러리에 오늘의 문제 결과 카드 올리기
- 일본: X(트위터)에 「#コロリン」 해시태그로 결과 카드 올리기 (일본은 Wordle류 공유 문화가 강해요)

**ASO**
- 1주일 뒤 스크린샷 첫 장의 문구를 A/B 테스트 (App Store Connect의 제품 페이지 최적화 기능)

**목표 순서**
1. 한국·일본 퍼즐 카테고리 Top 10
2. 미국 퍼즐 카테고리 Top 50
3. 숏폼이 하나라도 터지면 전체 차트 노리기

**봐야 할 숫자**
- D1 리텐션 40% 이상
- D7 리텐션 15% 이상
- 오늘의 문제 공유율 5% 이상

## 7. 다음 버전 백로그
1. 카카오톡 공유 카드 (이미지 + "나도 도전하기" 버튼)
2. 오늘의 문제 전 세계 통계 ("오늘 어려움 문제 3별 클리어 8%"), 백엔드 필요
3. 인앱결제
4. 친구 대결 링크 (스테이지 시드 공유)
5. 안드로이드 출시 (프로젝트는 이미 만들어져 있음, Play 콘솔 계정만 있으면 됨)
