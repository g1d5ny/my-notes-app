import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { FormValues, MemoType } from "@/type"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet } from "react-native"

interface FileDetailParams {
    id: number
    title: string
    content: string
    parentId: number | null
}
export const FileDetail = ({ id, title, content, parentId }: FileDetailParams) => {
    const db = useSQLiteContext()
    const { updateFileTitle, updateFileContent } = useUpdateMemo()

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { title, content },
        values: { title, content }
    })

    const updateViewedAt = async () => {
        const now = Math.floor(Date.now() / 1000)
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [now, id])
    }

    useEffect(() => {
        updateViewedAt()
    }, [])

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Controller
                control={control}
                name='title'
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => <TitleInput ref={ref} value={value} onChangeText={onChange} onBlur={() => handleSubmit(data => updateFileTitle({ title: data.title, memoId: id, parentId }))} />}
            />
            <Controller
                control={control}
                name='content'
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => <ContentInput value={value} onChangeText={onChange} onBlur={() => handleSubmit(data => updateFileContent({ content: data.content, memoId: id, parentId }))} />}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12
    }
})
