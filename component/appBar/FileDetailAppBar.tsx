import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { DATABASE_NAME, Memo } from "@/type"
import { router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useState } from "react"
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"
import { Styles } from "../../constant/Style"
import { InfoModal } from "../modal/InfoModal"
import { MessageModal } from "../modal/MessageModal"
import { FileEditOption } from "../option/FileEditOption"
import { AppBarForm } from "./AppBarForm"

interface FileDetailAppBarProps {
    memo: Memo
    titleRef: React.RefObject<TextInput>
}
export const FileDetailAppBar = ({ memo, titleRef }: FileDetailAppBarProps) => {
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    const { top } = useSafeAreaInsets()
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [infoModalVisible, setInfoModalVisible] = useState(false)

    const editFile = () => {
        titleRef.current?.focus()
    }

    const showDeleteModal = () => {
        setDeleteModalVisible(true)
    }

    const deleteFile = async () => {
        try {
            console.log("memo.id: ", memo.id)
            await db.runAsync(`DELETE FROM ${DATABASE_NAME} WHERE id = ?`, [memo.id])
        } catch (error) {
            console.error("메모 삭제 실패:", error)
        }
        setInfoModalVisible(false)
        Toast.show({
            text1: "삭제되었습니다.",
            type: "customToast",
            position: "bottom",
            visibilityTime: 3000
        })
        back()
    }

    const copyFile = () => {}

    const exportFile = () => {}

    const showInfoModal = () => {
        setInfoModalVisible(true)
    }

    const back = () => {
        router.back()
    }

    return (
        <>
            <AppBarForm>
                <View style={[Styles.row, styles.container]}>
                    <Pressable onPress={back}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
                    <FileEditOption editFile={editFile} showDeleteModal={showDeleteModal} copyFile={copyFile} exportFile={exportFile} showInfoModal={showInfoModal} />
                </View>
            </AppBarForm>
            <MessageModal message={"정말 삭제하시겠습니까?"} visible={deleteModalVisible} onDismiss={() => setDeleteModalVisible(false)} onConfirm={deleteFile} confirmText={"삭제"} />
            <InfoModal visible={infoModalVisible} onDismiss={() => setInfoModalVisible(false)} createdAt={memo.createdAt} updatedAt={memo.updatedAt} viewedAt={memo.viewedAt} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between"
    }
})
