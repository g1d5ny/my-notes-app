import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"
import { Styles } from "../../constant/Style"
import { InfoModal } from "../modal/InfoModal"
import { MessageModal } from "../modal/MessageModal"
import { FileEditOption } from "../option/FileEditOption"
import { AppBarForm } from "./AppBarForm"

export const FileDetailAppBar = ({ id }: { id: number }) => {
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [infoModalVisible, setInfoModalVisible] = useState(false)

    const deleteFile = async () => {
        await db.runAsync("DELETE FROM memo WHERE id = ?", [id])
        setInfoModalVisible(false)
        Toast.show({
            text1: "삭제되었습니다.",
            type: "customToast",
            position: "bottom",
            visibilityTime: 3000
        })
        router.back()
    }

    const back = () => {
        router.back()
    }

    return (
        <>
            <AppBarForm>
                <View style={styles.left}>
                    <Pressable onPress={back}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
                </View>
                <View style={[Styles.row, styles.right]}>
                    <FileEditOption setDeleteModalVisible={setDeleteModalVisible} setInfoModalVisible={setInfoModalVisible} />
                </View>
            </AppBarForm>
            <MessageModal message={"정말 삭제하시겠습니까?"} visible={deleteModalVisible} onDismiss={() => setDeleteModalVisible(false)} onConfirm={deleteFile} confirmText={"삭제"} />
            <InfoModal visible={infoModalVisible} onDismiss={() => setInfoModalVisible(false)} recentCreatedAt={"2025/04/26"} recentUpdatedAt={"2025/04/26"} recentViewedAt={"2025/04/26"} />
        </>
    )
}

const styles = StyleSheet.create({
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    },
    left: {
        flex: 1
    }
})
