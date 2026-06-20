import { Elevation, FontStyles } from "@/constant/Style"
import { hapticTap } from "@/function/haptics"
import { modalAtom, themeAtom } from "@/store"
import { useAtom, useAtomValue } from "jotai"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Modal } from "react-native-paper"

export const MessageModal = () => {
    const theme = useAtomValue(themeAtom)
    const [{ visible, message, onConfirm, confirmText }, setModal] = useAtom(modalAtom)

    const onDismiss = () => {
        setModal(prev => ({ ...prev, visible: false }))
    }

    return (
        <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer} style={styles.center}>
            <View style={[styles.modal, Elevation.high, { backgroundColor: theme.surface }]}>
                <View style={styles.messageContainer}>
                    <Text style={[FontStyles.Body, { color: theme.text, textAlign: "center" }]}>{message}</Text>
                </View>
                <View style={[styles.bottom, { borderColor: theme.border }]}>
                    <TouchableOpacity style={[styles.bottomOption, { borderRightWidth: StyleSheet.hairlineWidth, borderColor: theme.border }]} onPress={onDismiss}>
                        <Text style={[FontStyles.SubTitle, { color: theme.textSecondary }]}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bottomOption}
                        onPress={async () => {
                            hapticTap()
                            await onConfirm()
                            onDismiss()
                        }}
                    >
                        <Text style={[FontStyles.SubTitle, { color: theme.accent }]}>{confirmText}</Text>
                    </TouchableOpacity>
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
    messageContainer: {
        flex: 1,
        justifyContent: "center"
    },
    bottomOption: {
        flex: 1,
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    bottom: {
        width: "100%",
        height: 52,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: StyleSheet.hairlineWidth
    },
    modal: {
        alignItems: "center",
        borderRadius: 16,
        overflow: "hidden"
    },
    modalContainer: {
        width: 340,
        height: 144,
        alignItems: "center"
    }
})
