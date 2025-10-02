import { Search } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { Styles } from "../../constant/Style"
import { SettingOption } from "../option/SettingOption"

export default function MainAppBar() {
    const { theme } = useContext(ThemeContext)
    const [pressed, setPressed] = useState(false)

    return (
        <View style={[Styles.row, styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.left} />
            <View style={[Styles.row, styles.right]}>
                <Pressable onPress={() => setPressed(true)}>
                    <Search theme={theme} />
                </Pressable>
                <SettingOption />
            </View>
        </View>
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
