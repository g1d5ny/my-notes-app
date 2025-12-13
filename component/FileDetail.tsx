import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { sortAtom } from "@/store"
import { FormValues, Memo, MemoType } from "@/type"
import { useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useAtomValue } from "jotai"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet } from "react-native"

export const FileDetail = () => {
    const sortType = useAtomValue(sortAtom)
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const queryClient = useQueryClient()
    const { updateFileTitle, updateFileContent } = useUpdateMemo()
    const currentId = params?.id ? Number(params?.id) : 0
    const parentId = params.parentId ? Number(params.parentId) : null
    const memo = queryClient.getQueryData<Memo>([MemoType.FILE, currentId, sortType])

    const { control, handleSubmit } = useForm<FormValues>({
        defaultValues: { title: memo?.title ?? "", content: memo?.content ?? "" },
        values: { title: memo?.title ?? "", content: memo?.content ?? "" }
    })

    const updateViewedAt = async () => {
        const now = Math.floor(Date.now() / 1000)
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [now, currentId])
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
                render={({ field: { onChange, value, ref } }) => <TitleInput ref={ref} value={value} onChangeText={onChange} onBlur={() => handleSubmit(data => updateFileTitle({ title: data.title, memoId: memo?.id ?? 0, parentId }))} />}
            />
            <Controller
                control={control}
                name='content'
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => <ContentInput value={value} onChangeText={onChange} onBlur={() => handleSubmit(data => updateFileContent({ content: data.content, memoId: memo?.id ?? 0, parentId }))} />}
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
