import { Search } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { Styles } from "../../constant/Style"
import { InfoModal } from "../modal/InfoModal"
import { MessageModal } from "../modal/MessageModal"
import { FileEditOption } from "../option/FileEditOption"

export const FileEditAppBar = () => {
    const { theme } = useContext(ThemeContext)
    const [pressed, setPressed] = useState(false)
    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [infoModalVisible, setInfoModalVisible] = useState(false)

    return (
        <>
            <View style={[Styles.row, styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={styles.left} />
                <View style={[Styles.row, styles.right]}>
                    <Pressable onPress={() => setPressed(true)}>
                        <Search theme={theme} />
                    </Pressable>
                    <FileEditOption setDeleteModalVisible={setDeleteModalVisible} setInfoModalVisible={setInfoModalVisible} />
                </View>
            </View>
            <MessageModal message={"정말 삭제하시겠습니까?"} visible={deleteModalVisible} onDismiss={() => setDeleteModalVisible(false)} onConfirm={() => setDeleteModalVisible(false)} confirmText={"삭제"} />
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
    },
    container: {
        width: "100%",
        height: 56,
        paddingVertical: Platform.OS === "ios" ? 8 : 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1
    }
})
