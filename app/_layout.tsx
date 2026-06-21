import { AppBar } from "@/component/appBar"
import { FolderActionBottomBar } from "@/component/appBar/FolderActionBottomBar"
import { PasteBottomBar } from "@/component/appBar/PasteBottomBar"
import { CommonToast } from "@/component/CommonToast"
import { SearchInput } from "@/component/input/SearchInput"
import { AddMemoController } from "@/component/modal/add"
import { InfoModal } from "@/component/modal/InfoModal"
import { MessageModal } from "@/component/modal/MessageModal"
import RoutingHeader from "@/component/RoutingHeader"
import { StatusBar } from "@/component/StatusBar"
import { ThemeTransition } from "@/component/ThemeTransition"
import { customFontsToLoad } from "@/constant/Style"
import { schemeAtom, store, themeAtom } from "@/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as Font from "expo-font"
import { Slot } from "expo-router"
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite"
import { Provider, useAtomValue } from "jotai"
import { Suspense, useMemo } from "react"
import { StyleSheet } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { KeyboardProvider, KeyboardToolbar } from "react-native-keyboard-controller"
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper"
import { initialWindowMetrics, SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { DATABASE_NAME, MemoType } from "../type"

Font.loadAsync(customFontsToLoad)
const queryClient = new QueryClient()

function AppContent() {
    const theme = useAtomValue(themeAtom)
    const scheme = useAtomValue(schemeAtom)

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
            <Suspense fallback={<></>}>
                <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense onInit={migrateDbIfNeeded}>
                    <PaperProvider theme={paperTheme}>
                        <KeyboardProvider>
                            {/* bottom은 제외: 하단 바·FAB가 absolute 오버레이로 각자 insets.bottom을 처리하므로
                                여기서 bottom까지 패딩하면 그 부분만 인셋이 이중 적용된다. */}
                            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top", "left", "right"]}>
                                <StatusBar />
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
                                <ThemeTransition />
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
