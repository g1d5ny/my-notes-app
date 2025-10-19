import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { Memo } from "@/type"
import * as FileSystem from "expo-file-system"
import { router } from "expo-router"
import * as Sharing from "expo-sharing"
import { Dispatch, SetStateAction, useContext } from "react"
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native"
import Toast from "react-native-toast-message"
import { Styles } from "../../constant/Style"
import { FileEditOption } from "../option/FileEditOption"
import { AppBarForm } from "./AppBarForm"

export interface ModalVisible {
    deleteModalVisible: boolean
    infoModalVisible: boolean
}

interface FileDetailAppBarProps {
    memo: Memo
    titleRef: React.RefObject<TextInput>
    setModalVisible: Dispatch<SetStateAction<ModalVisible>>
}
export const FileDetailAppBar = ({ memo, titleRef, setModalVisible }: FileDetailAppBarProps) => {
    const { theme } = useContext(ThemeContext)

    const editFile = () => {
        titleRef.current?.focus()
    }

    const showDeleteModal = () => {
        setModalVisible(prev => ({ ...prev, deleteModalVisible: true }))
    }

    const exportFile = async () => {
        try {
            const title = memo.title.split("\n")[0]
            const fileUri = FileSystem.cacheDirectory + `${title}.txt`
            await FileSystem.writeAsStringAsync(fileUri, memo.content ?? "")
            await Sharing.shareAsync(fileUri)
        } catch (error) {
            console.error("파일 내보내기 실패:", error)
            Toast.show({
                text1: "파일 내보내기 실패했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        }
    }

    const showInfoModal = () => {
        setModalVisible(prev => ({ ...prev, infoModalVisible: true }))
    }

    const back = () => {
        router.back()
    }

    return (
        <AppBarForm>
            <View style={[Styles.row, styles.container]}>
                <Pressable onPress={back}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
                <FileEditOption editFile={editFile} showDeleteModal={showDeleteModal} exportFile={exportFile} showInfoModal={showInfoModal} />
            </View>
        </AppBarForm>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between"
    }
})
