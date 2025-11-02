import { FileDetailAppBar, ModalVisible } from "@/component/appBar/FileDetailAppBar"
import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { InfoModal } from "@/component/modal/InfoModal"
import { MessageModal } from "@/component/modal/MessageModal"
import { FormValues, Memo, MemoType } from "@/type"
import { router, usePathname } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, StyleSheet, TextInput } from "react-native"
import Toast from "react-native-toast-message"

export const FileDetail = ({ memo }: { memo: Memo }) => {
    const db = useSQLiteContext()
    const pathname = usePathname()

    const titleRef = useRef<TextInput>(null)
    const [{ deleteModalVisible, infoModalVisible }, setModalVisible] = useState<ModalVisible>({ deleteModalVisible: false, infoModalVisible: false })

    const { control, watch } = useForm<FormValues>({
        defaultValues: { title: memo.title ?? "", content: memo.content ?? "" },
        values: { title: memo.title ?? "", content: memo.content ?? "" }
    })

    const title = watch("title")
    const content = watch("content")

    const saveTitle = () => {
        db.runAsync(`UPDATE ${MemoType.FILE} SET title = ? WHERE id = ?`, [title, memo?.id])
    }

    const saveContent = async () => {
        await db.runAsync(`UPDATE ${MemoType.FILE} SET content = ? WHERE id = ?`, [content, memo?.id])
    }

    const deleteFile = async () => {
        await db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [memo?.id])
        Toast.show({
            text1: "글이 삭제되었습니다.",
            type: "customToast",
            position: "bottom",
            visibilityTime: 3000
        })
        router.back()
    }

    const updateViewedAt = async () => {
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [Math.floor(Date.now() / 1000), memo?.id])
    }

    useEffect(() => {
        updateViewedAt()
    }, [])

    return (
        <>
            <FileDetailAppBar memo={memo} titleRef={titleRef} setModalVisible={setModalVisible} />
            <ScrollView contentContainerStyle={styles.container}>
                <Controller control={control} name='title' rules={{ required: true }} render={({ field: { onChange, value } }) => <TitleInput ref={titleRef} value={value} onChangeText={onChange} onBlur={saveTitle} />} />
                <Controller control={control} name='content' rules={{ required: true }} render={({ field: { onChange, value } }) => <ContentInput value={value} onChangeText={onChange} onBlur={saveContent} />} />
            </ScrollView>
            <MessageModal message={"정말 삭제하시겠습니까?"} visible={deleteModalVisible} onDismiss={() => setModalVisible(prev => ({ ...prev, deleteModalVisible: false }))} onConfirm={deleteFile} confirmText={"삭제"} />
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
