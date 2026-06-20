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
import { SafeAreaView } from "react-native-safe-area-context"
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
        <Suspense fallback={<></>}>
            <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense onInit={migrateDbIfNeeded}>
                <PaperProvider theme={paperTheme}>
                    <KeyboardProvider>
                        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
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
                        </SafeAreaView>
                        <KeyboardToolbar>
                            <KeyboardToolbar.Done text='완료' />
                        </KeyboardToolbar>
                    </KeyboardProvider>
                </PaperProvider>
            </SQLiteProvider>
        </Suspense>
    )
}

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Provider store={store}>
                    <AppContent />
                </Provider>
            </GestureHandlerRootView>
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
