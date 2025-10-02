import { Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"
import { Platform, StyleSheet, View } from "react-native"

interface DefaultAppBarProps {
    children: React.ReactNode
}
export const AppBarForm = ({ children }: DefaultAppBarProps) => {
    const { theme } = useContext(ThemeContext)

    return <View style={[Styles.row, Platform.OS === "ios" ? styles.iosContainer : styles.androidContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>{children}</View>
}

const styles = StyleSheet.create({
    iosContainer: {
        width: "100%",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1
    },
    androidContainer: {
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1
    }
})
