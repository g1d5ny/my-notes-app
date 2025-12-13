import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { useGetMemo } from "@/hook/useGetMemo"
import { themeAtom } from "@/store"
import { FormValues, Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import * as FileSystem from "expo-file-system"
import { router } from "expo-router"
import * as Sharing from "expo-sharing"
import { useAtomValue } from "jotai"
import { Dispatch, SetStateAction } from "react"
import { UseFormSetFocus } from "react-hook-form"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"
import { Styles } from "../../constant/Style"
import { FileEditOption } from "../option/FileEditOption"
import { AppBarParent } from "./AppBarParent"

export interface ModalVisible {
    deleteModalVisible: boolean
    infoModalVisible: boolean
}

interface FileDetailAppBarProps {
    setModalVisible: Dispatch<SetStateAction<ModalVisible>>
    setFocus: UseFormSetFocus<FormValues>
}
export const FileDetailAppBar = ({ setModalVisible, setFocus }: FileDetailAppBarProps) => {
    const theme = useAtomValue(themeAtom)
    const { data: memo } = useGetMemo() as UseQueryResult<Memo, Error>

    const editFile = () => {
        setFocus("title")
    }

    const showDeleteModal = () => {
        setModalVisible(prev => ({ ...prev, deleteModalVisible: true }))
    }

    const exportFile = async () => {
        try {
            const title = memo?.title?.split("\n")[0] ?? ""
            const fileUri = FileSystem.cacheDirectory + `${title}.txt`
            await FileSystem.writeAsStringAsync(fileUri, memo?.content ?? "")
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
        <AppBarParent>
            <View style={[Styles.row, styles.container]}>
                <Pressable onPress={back}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
                <FileEditOption editFile={editFile} showDeleteModal={showDeleteModal} exportFile={exportFile} showInfoModal={showInfoModal} />
            </View>
        </AppBarParent>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between"
    }
})
