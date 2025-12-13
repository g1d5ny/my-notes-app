import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { useEditMemo } from "@/hook/useEditMemo"
import { useGetMemo } from "@/hook/useGetMemo"
import { FormValues, Memo, MemoType } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet } from "react-native"

export const FileDetail = () => {
    const { data: memo } = useGetMemo() as UseQueryResult<Memo, Error>
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { saveTitle, saveContent } = useEditMemo()
    const parentId = params.parentId ? Number(params.parentId) : null

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { title: memo?.title ?? "", content: memo?.content ?? "" },
        values: { title: memo?.title ?? "", content: memo?.content ?? "" }
    })

    const updateViewedAt = async () => {
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [Math.floor(Date.now() / 1000), memo?.id ?? 0])
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
                render={({ field: { onChange, value, ref } }) => <TitleInput ref={ref} value={value} onChangeText={onChange} onBlur={() => handleSubmit(data => saveTitle({ title: data.title, memoId: memo?.id ?? 0, parentId }))} />}
            />
            <Controller
                control={control}
                name='content'
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => <ContentInput value={value} onChangeText={onChange} onBlur={() => handleSubmit(data => saveContent({ content: data.content, memoId: memo?.id ?? 0, parentId }))} />}
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
