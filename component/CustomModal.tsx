import { Modal, StyleSheet, TouchableWithoutFeedback, View } from "react-native"

interface ModalWithDimProps {
    visible: boolean
    setVisible: (visible: boolean) => void
    children: React.ReactNode
}
export const CustomModal = ({ visible, setVisible, children }: ModalWithDimProps) => {
    return (
        <Modal visible={visible} transparent={true} onRequestClose={() => setVisible(false)}>
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View style={styles.background} />
                </TouchableWithoutFeedback>
                {children}
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    }
})
