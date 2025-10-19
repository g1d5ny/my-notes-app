import { FileDetailAppBar, ModalVisible } from "@/component/appBar/FileDetailAppBar"
import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { InfoModal } from "@/component/modal/InfoModal"
import { MessageModal } from "@/component/modal/MessageModal"
import { Memo, MemoType } from "@/type"
import { router, usePathname } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, TextInput } from "react-native"
import Toast from "react-native-toast-message"

export default function FolderScreen() {
    const pathname = usePathname()
    const db = useSQLiteContext()
    const titleRef = useRef<TextInput>(null)
    const [{ deleteModalVisible, infoModalVisible }, setModalVisible] = useState<ModalVisible>({ deleteModalVisible: false, infoModalVisible: false })
    const [memo, setMemo] = useState<Memo>({} as Memo)

    const onChangeTitle = (text: string) => {
        setMemo(prev => ({ ...prev, title: text }))
    }

    const saveTitle = () => {
        db.runAsync(`UPDATE ${MemoType.FILE} SET title = ? WHERE id = ?`, [memo?.title, memo?.id])
    }

    const onChangeContent = (text: string) => {
        setMemo(prev => ({ ...prev, content: text }))
    }

    const saveContent = () => {
        db.runAsync(`UPDATE ${MemoType.FILE} SET content = ? WHERE id = ?`, [memo?.content ?? "", memo?.id])
    }

    const deleteFile = async () => {
        try {
            await db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [memo.id])
            setModalVisible(prev => ({ ...prev, infoModalVisible: false }))
            Toast.show({
                text1: "삭제되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
            router.back()
        } catch (error) {
            console.error("메모 삭제 실패:", error)
        }
    }

    const loadMemoAndUpdateViewedAt = async () => {
        const result = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE path = ?`, [pathname])
        setMemo(result[0] as Memo)
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [Math.floor(Date.now() / 1000), (result[0] as Memo)?.id])
    }

    useEffect(() => {
        loadMemoAndUpdateViewedAt()
    }, [pathname])

    return (
        <>
            <FileDetailAppBar memo={memo} titleRef={titleRef} setModalVisible={setModalVisible} />
            <ScrollView contentContainerStyle={styles.container}>
                <TitleInput ref={titleRef} value={memo?.title} onChangeText={onChangeTitle} onBlur={saveTitle} />
                <ContentInput value={memo?.content} onChangeText={onChangeContent} onBlur={saveContent} />
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
