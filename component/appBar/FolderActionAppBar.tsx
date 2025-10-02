import { Close, Copy, Cut, Delete } from "@/assets/icons/svg/icon"
import { Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { MessageModal } from "../modal/MessageModal"
import { AppBarForm } from "./AppBarForm"

export const FolderActionAppBar = () => {
    const { theme } = useContext(ThemeContext)
    const [pressed, setPressed] = useState(false)
    const [visible, setVisible] = useState<boolean>(false)

    const icons = [
        {
            icon: <Copy theme={theme} />,
            onPress: () => {}
        },
        {
            icon: <Cut theme={theme} />,
            onPress: () => {}
        },
        {
            icon: <Delete theme={theme} />,
            onPress: () => setVisible(true)
        }
    ]

    return (
        <>
            <AppBarForm>
                <Pressable onPress={() => setPressed(true)}>
                    <Close theme={theme} />
                </Pressable>
                <View style={[Styles.row, styles.right]}>
                    {icons.map((icon, index) => (
                        <Pressable key={index} onPress={icon.onPress}>
                            {icon.icon}
                        </Pressable>
                    ))}
                </View>
            </AppBarForm>
            <MessageModal message={"정말 삭제하시겠습니까?"} visible={visible} onDismiss={() => setVisible(false)} onConfirm={() => setVisible(false)} confirmText={"삭제"} />
        </>
    )
}

const styles = StyleSheet.create({
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    }
})
