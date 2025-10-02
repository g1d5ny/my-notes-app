import { FontStyles, Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Modal } from "react-native-paper"

interface InfoModalProps {
    visible: boolean
    onDismiss: () => void
    recentCreatedAt: string
    recentUpdatedAt: string
    recentViewedAt: string
}

export const InfoModal = ({ visible, onDismiss, recentCreatedAt, recentUpdatedAt, recentViewedAt }: InfoModalProps) => {
    const { theme } = useContext(ThemeContext)

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer} style={{ alignItems: "center", justifyContent: "center" }}>
            <View style={[styles.modal, { backgroundColor: theme.background }]}>
                <View style={[Styles.row, styles.messageContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 생성 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{recentCreatedAt}</Text>
                </View>
                <View style={[Styles.row, styles.messageContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 수정 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{recentUpdatedAt}</Text>
                </View>
                <View style={[Styles.row, styles.messageContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 조회 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{recentViewedAt}</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        width: "100%",
        height: 36,
        paddingVertical: 8,
        justifyContent: "space-between"
    },
    modal: {
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 28,
        paddingVertical: 16
    },
    modalContainer: {
        width: 240,
        height: 140
    }
})
