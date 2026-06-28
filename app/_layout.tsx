import { AppBar } from "@/component/appBar"
import { FolderActionBottomBar } from "@/component/appBar/FolderActionBottomBar"
import { PasteBottomBar } from "@/component/appBar/PasteBottomBar"
import { CommonToast } from "@/component/CommonToast"
import { SearchInput } from "@/component/input/SearchInput"
import { AddMemoController } from "@/component/modal/add"
import { InfoModal } from "@/component/modal/InfoModal"
import { MessageModal } from "@/component/modal/MessageModal"
import RoutingHeader from "@/component/RoutingHeader"
import { useOtaUpdate } from "@/hook/useOtaUpdate"
import { customFontsToLoad } from "@/constant/Style"
import { schemeAtom, store, themeAtom } from "@/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useFonts } from "expo-font"
import { Slot } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { DarkTheme } from "@/constant/Theme"
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite"
import { Provider, useAtomValue } from "jotai"
import { Suspense, useEffect, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { SystemBars } from "react-native-edge-to-edge"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider, KeyboardToolbar } from "react-native-keyboard-controller"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { DATABASE_NAME, MemoType } from "../type"

// 폰트 로드 전 첫 페인트를 막는다. TextInput placeholder(네이티브 hint)는 폰트가
// 늦게 로드되면 Paint가 폴백으로 굳어 글리프가 깨진 채 갱신되지 않으므로, 로드 완료까지 스플래시 유지.
SplashScreen.preventAutoHideAsync()
const queryClient = new QueryClient()

function AppContent() {
    const theme = useAtomValue(themeAtom)
    const scheme = useAtomValue(schemeAtom)

    // 백그라운드→포그라운드 복귀 시 OTA 업데이트를 확인해, 있으면 모달로 물어보고 받아서 재시작한다.
    useOtaUpdate()

    // 상태바 글씨색은 SystemBars로 앱 테마 기준 지정(시스템 scheme 아님). schemeAtom은 hydration 통지가
    // 누락될 수 있어, 확실히 갱신되는 themeAtom으로 판정한다.
    const isDark = theme.background === DarkTheme.background
    const insets = useSafeAreaInsets()

    // Paper의 Modal 백드롭·Menu surface 등 기본값을 앱 팔레트/스킴에 맞춘다.
    const paperTheme = useMemo(() => {
        const base = scheme === "dark" ? MD3DarkTheme : MD3LightTheme
        return {
            ...base,
            colors: {
                ...base.colors,
                primary: theme.accent,
                background: theme.background,
                surface: theme.surface,
                onSurface: theme.text,
                outline: theme.border
            }
        }
    }, [scheme, theme])

    return (
        // edge-to-edge(app.json android.edgeToEdgeEnabled)로 윈도우가 풀블리드라, GHR 테마 배경이
        // 시스템 바 밑까지 깔린다. 인셋은 SafeAreaView가 "한 번만" 적용(이중 인셋/콜드 스타트 레이스 제거).
        <GestureHandlerRootView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* 아이콘색만 담당(다크 테마=흰 글씨). 배경은 GHR의 theme.background가 그린다.
                key로 테마 전환 시 강제 재적용 → 앱 실행 중 라이트↔다크 토글에도 상태바가 즉시 갱신. */}
            <SystemBars key={isDark ? "dark" : "light"} style={isDark ? "light" : "dark"} />
            {/* 상태바 뒤(투명)에 테마색을 직접 그리는 절대배치 View. React가 그려서 라이브 토글에도 즉시 갱신.
                (하단 내비바는 하단 바/FAB가 처리하므로 여기선 상단만.) */}
            <View pointerEvents='none' style={[styles.topInset, { height: insets.top, backgroundColor: theme.background }]} />
            <Suspense fallback={<></>}>
                <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense onInit={migrateDbIfNeeded}>
                    <PaperProvider theme={paperTheme}>
                        <KeyboardProvider>
                            {/* bottom은 제외: 하단 바·FAB가 absolute 오버레이로 각자 insets.bottom을 처리하므로
                                여기서 bottom까지 패딩하면 그 부분만 인셋이 이중 적용된다. */}
                            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
                                <AppBar />
                                <SearchInput />
                                <RoutingHeader />
                                <Slot />
                                <AddMemoController />
                                <FolderActionBottomBar />
                                <PasteBottomBar />
                                <MessageModal />
                                <InfoModal />
                                <CommonToast />
                            </SafeAreaView>
                            <KeyboardToolbar>
                                <KeyboardToolbar.Done text='완료' />
                            </KeyboardToolbar>
                        </KeyboardProvider>
                    </PaperProvider>
                </SQLiteProvider>
            </Suspense>
        </GestureHandlerRootView>
    )
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts(customFontsToLoad)

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync()
    }, [fontsLoaded])

    // 폰트가 준비되기 전엔 스플래시를 유지(null 렌더) → 모든 텍스트·placeholder가 폰트로 첫 페인트.
    if (!fontsLoaded) return null

    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                {/* initialMetrics로 첫 프레임부터 인셋 확정 → 콜드 스타트 시 헤더가 밀렸다 돌아오는 깜빡임 제거. */}
                <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                    <AppContent />
                </SafeAreaProvider>
            </Provider>
        </QueryClientProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    topInset: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
    }
})

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1
    const result = await db.getFirstAsync<{ user_version: number }>("PRAGMA user_version")
    const currentDbVersion = result?.user_version ?? 0
    if (currentDbVersion >= DATABASE_VERSION) {
        return
    }
    if (currentDbVersion === 0) {
        // ✅ 1단계: journal_mode 설정 (성능 개선)
        await db.execAsync(`PRAGMA journal_mode = WAL;`)
        // ✅ 2단계: memo folder 테이블 생성
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${MemoType.FOLDER} (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                parentId INTEGER,
                createdAt INTEGER NOT NULL,
                updatedAt INTEGER NOT NULL,
                FOREIGN KEY (parentId) REFERENCES ${MemoType.FOLDER}(id) ON DELETE CASCADE
            );
        `)
        // ✅ 2단계: memo file 테이블 생성
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS ${MemoType.FILE} (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                parentId INTEGER,
                createdAt INTEGER NOT NULL,
                updatedAt INTEGER NOT NULL,
                viewedAt INTEGER NOT NULL,
                FOREIGN KEY (parentId) REFERENCES ${MemoType.FOLDER}(id) ON DELETE CASCADE
            );
        `)
        // ✅ 3단계: 초기 더미 데이터 삽입 (옵션)
        // const now = Math.floor(Date.now() / 1000)
        //     await db.runAsync(
        //         `INSERT INTO memo (type, title, content, parentId, path, createdAt, updatedAt)
        //    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        //         ["note", "환영합니다!", "이건 기본 메모입니다. 자유롭게 수정하거나 삭제해보세요.", null, "/환영합니다", now, now]
        //     )
        // ✅ 4단계: DB 버전 업데이트
        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    }
    // await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
    // await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
    // await db.execAsync(`DROP TABLE IF EXISTS ${MemoType.FOLDER}`)
    // await db.execAsync(`DROP TABLE IF EXISTS ${MemoType.FILE}`)
    // db.execAsync(`PRAGMA user_version = 0`)
}
