import { useContext } from "react"
import { Image, Platform, Pressable, StyleSheet, View } from "react-native"
import { Styles } from "../constant/Style"
import { ThemeContext } from "../context/ThemeContext"

export default function AppBar() {
    const { theme } = useContext(ThemeContext)

    return (
        <View style={[Styles.row, styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.left}></View>
            <View style={[Styles.row, styles.right]}>
                <Pressable>
                    <Image source={require("@/assets/icons/light/icon_search.png")} />
                </Pressable>
                <Pressable>
                    <Image source={require("@/assets/icons/light/icon_three_dots_horizontal.png")} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    left: {
        flex: 1
    },
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    },
    container: {
        width: "100%",
        paddingVertical: Platform.OS === "ios" ? 8 : 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1
    }
})
