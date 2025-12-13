import { Styles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { Platform, StyleSheet, View } from "react-native"

interface DefaultAppBarProps {
    children: React.ReactNode
}
export const AppBarParent = ({ children }: DefaultAppBarProps) => {
    const theme = useAtomValue(themeAtom)

    return <View style={[Styles.row, Platform.OS === "ios" ? styles.iosContainer : styles.androidContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>{children}</View>
}

const styles = StyleSheet.create({
    iosContainer: {
        width: "100%",
        height: 44,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1
    },
    androidContainer: {
        width: "100%",
        height: 56,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1
    }
})
