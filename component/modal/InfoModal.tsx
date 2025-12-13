import { FontStyles, Styles } from "@/constant/Style"
import { infoModalVisibleAtom, sortAtom, themeAtom } from "@/store"
import { Memo, MemoType } from "@/type"
import { useQueryClient } from "@tanstack/react-query"
import { useGlobalSearchParams } from "expo-router"
import { useAtom, useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"
import { Modal } from "react-native-paper"

const formatUnixTime = (unixTime: number) => {
    if (!unixTime || Number.isNaN(unixTime)) return ""
    const date = new Date(unixTime * 1000) // Unix timestamp는 초 단위이므로 1000을 곱해 밀리초로 변환
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}/${month}/${day}`
}

export const InfoModal = () => {
    const theme = useAtomValue(themeAtom)
    const sortType = useAtomValue(sortAtom)
    const queryClient = useQueryClient()
    const params = useGlobalSearchParams()
    const [infoModalVisible, setInfoModalVisible] = useAtom(infoModalVisibleAtom)
    const currentId = params.id ? Number(params?.id) : 0
    const memo = queryClient.getQueryData<Memo>([MemoType.FILE, currentId, sortType])

    return (
        <Modal visible={infoModalVisible} onDismiss={() => setInfoModalVisible(false)} contentContainerStyle={styles.modalContainer} style={styles.center}>
            <View style={[styles.modal, { backgroundColor: theme.background }]}>
                <View style={[Styles.row, styles.dateContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 생성 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{formatUnixTime(memo?.createdAt ?? 0)}</Text>
                </View>
                <View style={[Styles.row, styles.dateContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 수정 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{formatUnixTime(memo?.updatedAt ?? 0)}</Text>
                </View>
                <View style={[Styles.row, styles.dateContainer]}>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>최근 조회 시간</Text>
                    <Text style={[FontStyles.BodySmall, { color: theme.gray }]}>{formatUnixTime(memo?.viewedAt ?? 0)}</Text>
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
