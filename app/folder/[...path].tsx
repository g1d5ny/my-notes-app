import { FileDetailAppBar } from "@/component/appBar/FileDetailAppBar"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { Memo } from "@/type"
import { usePathname } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text } from "react-native"

export default function FolderScreen() {
    const pathname = usePathname()
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()

    const segments = pathname.split("/").filter(Boolean).slice(1)
    const type = segments.includes("/folder") ? "folder" : "file"
    const [memo, setMemo] = useState<Memo[]>([])

    useEffect(() => {
        db.getAllAsync("SELECT * FROM memo WHERE path = ?", [pathname]).then(result => {
            setMemo(result as Memo[])
        })
    }, [pathname])

    return (
        <>
            <FileDetailAppBar id={memo[0]?.id ?? 0} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={[styles.title, { color: theme.text }]}>{memo[0]?.title}</Text>
                <Text style={[styles.content, { color: theme.text }]}>{memo[0]?.content}</Text>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    content: {
        ...FontStyles.SubTitle
    },
    title: {
        ...FontStyles.Title
    },
    container: {
        padding: 16,
        gap: 12
    }
})
