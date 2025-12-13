import { FileDetailAppBar, ModalVisible } from "@/component/appBar/FileDetailAppBar"
import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { InfoModal } from "@/component/modal/InfoModal"
import { MessageModal } from "@/component/modal/MessageModal"
import { useEditMemo } from "@/hook/useEditMemo"
import { useGetMemo } from "@/hook/useGetMemo"
import { FormValues, Memo, MemoType } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet } from "react-native"

export const FileDetail = () => {
    const { data: memo } = useGetMemo() as UseQueryResult<Memo, Error>
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const { saveTitle, saveContent, deleteMemo } = useEditMemo()
    const parentId = params.parentId ? Number(params.parentId) : null
    const [{ deleteModalVisible, infoModalVisible }, setModalVisible] = useState<ModalVisible>({ deleteModalVisible: false, infoModalVisible: false })

    const { control, setFocus, handleSubmit } = useForm<FormValues>({
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
        <>
            <FileDetailAppBar setModalVisible={setModalVisible} setFocus={setFocus} />
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
            <MessageModal
                message={"정말 삭제하시겠습니까?"}
                visible={deleteModalVisible}
                onDismiss={() => setModalVisible(prev => ({ ...prev, deleteModalVisible: false }))}
                onConfirm={() => deleteMemo({ memoId: memo?.id ?? 0, parentId })}
                confirmText={"삭제"}
            />
            {memo?.type === MemoType.FILE && (
                <InfoModal visible={infoModalVisible} onDismiss={() => setModalVisible(prev => ({ ...prev, infoModalVisible: false }))} createdAt={memo?.createdAt ?? 0} updatedAt={memo?.updatedAt ?? 0} viewedAt={memo?.viewedAt ?? 0} />
            )}
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
