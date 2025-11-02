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

export const FileDetail = ({ memo }: { memo: Memo }) => {
    const db = useSQLiteContext()
    const pathname = usePathname()
    const titleRef = useRef<TextInput>(null)
    const [{ deleteModalVisible, infoModalVisible }, setModalVisible] = useState<ModalVisible>({ deleteModalVisible: false, infoModalVisible: false })
    const [currentMemo, setCurrentMemo] = useState<Memo>(memo)

    const onChangeTitle = (text: string) => {
        setCurrentMemo(prev => ({ ...prev, title: text }))
    }

    const saveTitle = () => {
        db.runAsync(`UPDATE ${MemoType.FILE} SET title = ? WHERE id = ?`, [currentMemo?.title, currentMemo?.id])
    }

    const onChangeContent = (text: string) => {
        setCurrentMemo(prev => ({ ...prev, content: text }))
    }

    const saveContent = () => {
        db.runAsync(`UPDATE ${MemoType.FILE} SET content = ? WHERE id = ?`, [currentMemo?.content ?? "", currentMemo?.id])
    }

    const deleteFile = () => {
        db.runAsync(`DELETE FROM ${MemoType.FILE} WHERE id = ?`, [currentMemo?.id])
        router.back()
    }

    const updateViewedAt = async () => {
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [Math.floor(Date.now() / 1000), currentMemo?.id])
    }

    useEffect(() => {
        updateViewedAt()
    }, [])

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
