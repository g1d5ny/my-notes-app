import { Color, FontStyles } from "@/constant/Style"
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
            <View style={[styles.modal, { backgroundColor: theme.background }]}>
                <View style={styles.messageContainer}>
                    <Text style={[FontStyles.Body, { color: theme.text, textAlign: "center" }]}>{message}</Text>
                </View>
                <View style={[styles.bottom, { borderColor: theme.border }]}>
                    <TouchableOpacity style={[styles.bottomOption, { borderRightWidth: 1, borderColor: theme.border }]} onPress={onDismiss}>
                        <Text style={[FontStyles.SubTitle, { color: Color.cancel }]}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.bottomOption}
                        onPress={async () => {
                            await onConfirm()
                            onDismiss()
                        }}
                    >
                        <Text style={[FontStyles.SubTitle, { color: Color.yellow[1] }]}>{confirmText}</Text>
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
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1
    },
    modal: {
        alignItems: "center",
        borderRadius: 12
    },
    modalContainer: {
        width: 300,
        height: 144,
        alignItems: "center"
    }
})
