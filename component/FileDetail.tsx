import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { FormValues, MemoType } from "@/type"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet } from "react-native"
import Toast from "react-native-toast-message"

interface FileDetailParams {
    id: number
    title: string
    content: string
    parentId: number | null
}
export const FileDetail = ({ id, title, content, parentId }: FileDetailParams) => {
    const db = useSQLiteContext()
    const { updateFileTitle, updateFileContent } = useUpdateMemo()

    const { control, getValues, setFocus } = useForm<FormValues>({
        defaultValues: { title, content }
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
                render={({ field: { onChange, value, ref } }) => (
                    <TitleInput
                        ref={ref}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => {
                            const data = getValues()
                            if (data.title.length === 0) {
                                Toast.show({
                                    text1: "제목을 입력해주세요.",
                                    type: "customToast",
                                    position: "bottom",
                                    visibilityTime: 3000
                                })
                                return
                            }
                            updateFileTitle({ title: data.title, memoId: id, parentId })
                        }}
                    />
                )}
            />
            <Controller
                control={control}
                name='content'
                rules={{ required: true }}
                render={({ field: { onChange, value, ref } }) => (
                    <ContentInput
                        ref={ref}
                        value={value}
                        onChangeText={onChange}
                        onBlur={() => {
                            const data = getValues()
                            if (data.content.length === 0) {
                                Toast.show({
                                    text1: "내용을 입력해주세요.",
                                    type: "customToast",
                                    position: "bottom",
                                    visibilityTime: 3000
                                })
                                return
                            }
                            updateFileContent({ content: data.content, memoId: id, parentId })
                        }}
                    />
                )}
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
