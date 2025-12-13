import { FontStyles, Styles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"
import { Modal } from "react-native-paper"

interface InfoModalProps {
    visible: boolean
    onDismiss: () => void
    createdAt: number
    updatedAt: number
    viewedAt: number
}

const formatUnixTime = (unixTime: number) => {
    if (!unixTime || Number.isNaN(unixTime)) return ""
    const date = new Date(unixTime * 1000) // Unix timestamp는 초 단위이므로 1000을 곱해 밀리초로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}/${month}/${day}`
}

export const InfoModal = ({ visible, onDismiss, createdAt, updatedAt, viewedAt }: InfoModalProps) => {
    const theme = useAtomValue(themeAtom)

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer} style={styles.center}>
            <View style={[styles.modal, { backgroundColor: theme.background }]}>
                <View style={[Styles.row, styles.dateContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 생성 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{formatUnixTime(createdAt)}</Text>
                </View>
                <View style={[Styles.row, styles.dateContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 수정 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{formatUnixTime(updatedAt)}</Text>
                </View>
                <View style={[Styles.row, styles.dateContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 조회 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{formatUnixTime(viewedAt)}</Text>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    center: {
        alignItems: "center",
        justifyContent: "center"
    },
    dateContainer: {
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
