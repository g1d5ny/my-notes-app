import { FileDetailAppBar } from "@/component/appBar/FileDetailAppBar"
import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { ThemeContext } from "@/context/ThemeContext"
import { DATABASE_NAME, Memo } from "@/type"
import { usePathname } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, TextInput } from "react-native"

export default function FolderScreen() {
    const pathname = usePathname()
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    const titleRef = useRef<TextInput>(null)
    const [memo, setMemo] = useState<Memo>({} as Memo)

    const onChangeTitle = (text: string) => {
        setMemo(prev => ({ ...prev, title: text }))
    }

    const saveTitle = () => {
        db.runAsync(`UPDATE ${DATABASE_NAME} SET title = ? WHERE id = ?`, [memo?.title, memo?.id])
    }

    const onChangeContent = (text: string) => {
        setMemo(prev => ({ ...prev, content: text }))
    }

    const saveContent = () => {
        db.runAsync(`UPDATE ${DATABASE_NAME} SET content = ? WHERE id = ?`, [memo?.content, memo?.id])
    }

    const loadMemoAndUpdateViewedAt = async () => {
        const result = await db.getAllAsync(`SELECT * FROM ${DATABASE_NAME} WHERE path = ?`, [pathname])
        setMemo(result[0] as Memo)

        await db.runAsync(`UPDATE ${DATABASE_NAME} SET viewedAt = ? WHERE id = ?`, [Math.floor(Date.now() / 1000), (result[0] as Memo)?.id])
    }

    useEffect(() => {
        loadMemoAndUpdateViewedAt()
    }, [pathname])

    return (
        <>
            <FileDetailAppBar memo={memo} titleRef={titleRef} />
            <ScrollView contentContainerStyle={styles.container}>
                <TitleInput ref={titleRef} onChangeText={onChangeTitle} onBlur={saveTitle}>
                    {memo?.title}
                </TitleInput>
                <ContentInput onChangeText={onChangeContent} onBlur={saveContent}>
                    {memo?.content}
                </ContentInput>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12
    }
})
