import { Close, Copy, Cut, Delete } from "@/assets/icons/svg/icon"
import { Styles } from "@/constant/Style"
import { modalAtom, themeAtom } from "@/store"
import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { AppBarParent } from "./AppBarParent"

export const FolderActionAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const [pressed, setPressed] = useState(false)
    const setModal = useSetAtom(modalAtom)

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
            onPress: () => setModal(prev => ({ ...prev, visible: true, message: "정말 삭제하시겠습니까?", onConfirm: () => {}, confirmText: "삭제" }))
        }
    ]

    return (
        <AppBarParent>
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
        </AppBarParent>
    )
}

const styles = StyleSheet.create({
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    }
})
