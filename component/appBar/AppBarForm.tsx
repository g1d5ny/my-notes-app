import { Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"
import { Platform, StyleSheet, View } from "react-native"

interface DefaultAppBarProps {
    children: React.ReactNode
}
export const AppBarForm = ({ children }: DefaultAppBarProps) => {
    const { theme } = useContext(ThemeContext)

    return <View style={[Styles.row, styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>{children}</View>
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        // height: Platform.OS === "ios" ? 44 : 56,
        paddingVertical: Platform.OS === "ios" ? 8 : 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1
    }
})
