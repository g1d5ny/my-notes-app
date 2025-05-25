import AppBar from "@/component/AppBar"
import RoutingHeader from "@/component/RoutingHeader"
import { DarkTheme, LightTheme } from "@/constant/Theme"
import { ThemeContext } from "@/context/ThemeContext"
import { Slot } from "expo-router"
import { SQLiteDatabase, SQLiteProvider } from "expo-sqlite"
import { Suspense, useState } from "react"
import { ActivityIndicator, StyleSheet, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { ThemeColorPalette } from "../type"

export const DATABASE_NAME = "memo"

export default function RootLayout() {
    const scheme = useColorScheme()
    const currentTheme = scheme === "dark" ? DarkTheme : LightTheme
    const [theme, setTheme] = useState<ThemeColorPalette>(currentTheme)

    return (
        <Suspense fallback={<ActivityIndicator size='large' />}>
            <SQLiteProvider databaseName={DATABASE_NAME} options={{ enableChangeListener: true }} useSuspense onInit={migrateDbIfNeeded}>
                <ThemeContext.Provider value={{ theme, setTheme }}>
                    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                        <AppBar />
                        <RoutingHeader />
                        <Slot />
                    </SafeAreaView>
                </ThemeContext.Provider>
            </SQLiteProvider>
        </Suspense>
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

        // ✅ 2단계: memo 테이블 생성
        await db.execAsync(`
      CREATE TABLE IF NOT EXISTS memo (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        parentId TEXT,
        path TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      );
    `)

        // ✅ 3단계: 초기 더미 데이터 삽입 (옵션)
        const now = Math.floor(Date.now() / 1000)
        await db.runAsync(
            `INSERT INTO memo (type, title, content, parentId, path, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            ["note", "환영합니다!", "이건 기본 메모입니다. 자유롭게 수정하거나 삭제해보세요.", null, "/환영합니다", now, now]
        )

        // ✅ 4단계: DB 버전 업데이트
        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
    }

    // TODO: currentDbVersion === 1일 경우 추가 마이그레이션
}
