import { CommonToast } from "@/component/CommonToast"
import { customFontsToLoad } from "@/constant/Style"
import { DarkTheme, LightTheme } from "@/constant/Theme"
import { ThemeContext } from "@/context/ThemeContext"
import { ToastContext } from "@/context/ToastContext"
import { queryClient } from "@/store"
import { QueryClientProvider } from "@tanstack/react-query"
import * as Font from "expo-font"
import { Slot } from "expo-router"
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite"
import { Suspense, useState } from "react"
import { ColorSchemeName, Platform, StatusBar, StyleSheet, useColorScheme } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { PaperProvider } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import { DATABASE_NAME, MemoType, ThemeColorPalette } from "../type"

Font.loadAsync(customFontsToLoad)

export default function RootLayout() {
    const scheme = useColorScheme()
    const currentTheme = scheme === "dark" ? DarkTheme : LightTheme
    const [currentScheme, setCurrentScheme] = useState<ColorSchemeName>(scheme)
    const [theme, setTheme] = useState<ThemeColorPalette>(currentTheme)
    const [message, setMessage] = useState<string>("")

    const barStyle = () => {
        if (Platform.OS === "android") {
            return "dark-content"
        }
        return currentScheme === "dark" ? "light-content" : "dark-content"
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Suspense fallback={<></>}>
                    <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense onInit={migrateDbIfNeeded}>
                        <ThemeContext.Provider value={{ theme, setTheme, currentScheme, setCurrentScheme }}>
                            <StatusBar barStyle={barStyle()} />
                            <ToastContext.Provider value={{ message, setMessage }}>
                                <PaperProvider>
                                    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                                        <Slot />
                                        <CommonToast />
                                    </SafeAreaView>
                                </PaperProvider>
                            </ToastContext.Provider>
                        </ThemeContext.Provider>
                    </SQLiteProvider>
                </Suspense>
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
                parentId TEXT NOT NULL,
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
                parentId TEXT NOT NULL,
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
}
