# 오늘모쓰지? 📒

> 오늘의 기록, 한 장

폴더와 파일로 메모를 정리하는 모바일 노트 앱. 직관적인 드래그 정리, OS 네이티브 같은 모션과 햅틱, 다크/라이트 테마, OTA 업데이트를 지원합니다.

Expo SDK 53 · React Native 0.79 · React 19 · TypeScript 기반의 iOS/Android 앱입니다.

---

## ✨ 주요 기능

- **폴더/파일 메모 관리** — 폴더 안에 폴더·파일을 무제한으로 중첩해 정리
- **드래그로 폴더 이동** — 항목을 길게 눌러 폴더 위로 드래그(hover 확대·햅틱·원위치 복귀)
- **다중 선택 & 붙여넣기** — 여러 항목을 선택해 하단 액션 바에서 한 번에 이동
- **제목 인라인 편집** — 항목 제목을 탭해 그 자리에서 바로 수정
- **검색 / 정렬** — 메모 검색, 생성·수정·제목 순 정렬
- **다크 / 라이트 테마** — 앱 내에서 즉시 전환(시스템 바·배경 라이브 갱신)
- **햅틱 & 네이티브 모션** — 동작마다 촉각 피드백, 부드러운 화면 전환
- **풀스크린 스플래시** — 브랜드 디자인 스플래시(인앱 오버레이)
- **OTA 업데이트** — 새 버전이 있으면 모달로 안내하고 받아서 즉시 재시작
- **공유 / 내보내기** — 메모를 다른 앱으로 공유·내보내기

---

## 🧱 기술 스택

| 영역              | 사용 기술                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------- |
| 프레임워크        | Expo SDK 53, React Native 0.79, React 19 (New Architecture / Fabric)                        |
| 라우팅            | expo-router (파일 기반 라우팅)                                                              |
| 언어              | TypeScript                                                                                  |
| 상태 관리         | Jotai                                                                                       |
| 데이터 캐시       | TanStack Query (React Query)                                                                |
| 로컬 DB           | expo-sqlite (런타임), Drizzle ORM + drizzle-kit (스키마/마이그레이션)                       |
| UI                | React Native Paper, react-native-svg, @gorhom/bottom-sheet                                  |
| 애니메이션/제스처 | react-native-reanimated, react-native-gesture-handler                                       |
| 폼                | react-hook-form                                                                             |
| 햅틱              | expo-haptics                                                                                |
| OTA               | expo-updates (EAS Update)                                                                   |
| 키보드/인셋       | react-native-keyboard-controller, react-native-safe-area-context, react-native-edge-to-edge |

---

## 📁 프로젝트 구조

```
.
├── app/              # expo-router 화면 (파일 기반 라우팅)
│   ├── _layout.tsx       # 루트 레이아웃 (프로바이더·스플래시·OTA)
│   ├── index.tsx         # 홈(루트 폴더)
│   └── folder/           # 폴더/파일 상세 라우트
├── component/        # UI 컴포넌트
│   ├── appBar/           # 상단/하단 액션 바
│   ├── input/            # 검색 입력 등
│   ├── modal/            # 메시지·정보·메모 추가 모달
│   ├── option/           # 옵션 메뉴
│   ├── DraggableMemoIcon.tsx  # 드래그 가능한 메모 아이콘
│   ├── FolderList.tsx         # 폴더/파일 그리드
│   └── AppSplash.tsx          # 인앱 풀스크린 스플래시
├── hook/             # 커스텀 훅 (CRUD·검색·정렬·OTA 등)
├── store/            # Jotai atom (테마·검색·선택·모달 등)
├── function/         # 햅틱·쿼리 무효화 등 유틸
├── db/               # Drizzle 스키마 (schema.ts)
├── drizzle/          # 생성된 마이그레이션
├── constant/         # 테마 팔레트·스타일 상수
├── type/             # 공용 타입
├── assets/           # 아이콘·스플래시·폰트
├── ios/ · android/   # 네이티브 프로젝트 (prebuild)
└── eas.json          # EAS 빌드/제출 프로파일
```

---

## 🚀 시작하기

### 요구 사항

- Node.js 20+
- Yarn
- iOS: Xcode / Android: Android Studio (네이티브 빌드 시)

### 설치 & 실행

```bash
yarn install

# 개발 서버
yarn start

# 네이티브 빌드로 실행
yarn ios       # iOS 시뮬레이터
yarn android   # Android 에뮬레이터
```

### 스크립트

| 명령                        | 설명                                               |
| --------------------------- | -------------------------------------------------- |
| `yarn start`                | Expo 개발 서버                                     |
| `yarn ios` / `yarn android` | 네이티브 실행                                      |
| `yarn lint`                 | ESLint                                             |
| `yarn test`                 | Jest (watch)                                       |
| `yarn db:generate`          | Drizzle 마이그레이션 생성 (`drizzle-kit generate`) |

---

## 🗄️ 데이터베이스

메모는 기기 로컬 **SQLite**(`expo-sqlite`)에 저장됩니다. 스키마는 **Drizzle ORM**(`db/schema.ts`)으로 정의하고, 마이그레이션은 `drizzle-kit`으로 생성합니다.

```bash
yarn db:generate   # 또는 npx drizzle-kit generate
```

- 테이블: `folder`, `file` (폴더는 자기참조 `parentId`로 트리 구성)
- 앱 첫 실행 시 `app/_layout.tsx`의 `migrateDbIfNeeded`가 테이블을 생성합니다.

---

## 📦 빌드 & 배포

[EAS](https://docs.expo.dev/eas/)로 빌드/제출합니다. 프로파일은 `eas.json` 참고.

```bash
# 빌드
eas build --platform ios --profile production
eas build --platform android --profile production

# 스토어 제출 (TestFlight / Play 내부 테스트)
eas build --platform ios --profile production --auto-submit

# OTA 업데이트 배포 (JS 변경만 즉시 반영)
eas update --channel ver*
```

- **번들 ID / 패키지**: `com.jiwonsuk.mynotesapp`
- **OTA 채널**: `ver100` (runtimeVersion `1.0.0`)
- 새 버전이 있으면 앱이 포그라운드로 복귀할 때 업데이트 모달을 띄웁니다(`hook/useOtaUpdate.ts`).

> ⚠️ 네이티브 설정(아이콘·스플래시·플러그인 등) 변경은 새 빌드부터 반영됩니다. JS/에셋만 바뀐 변경은 `eas update`로 OTA 배포할 수 있습니다.

---

## 📱 지원 플랫폼

iOS · Android (웹은 비활성화 — `platforms: ["ios", "android"]`)
