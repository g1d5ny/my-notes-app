import { FontStyles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { usePathname } from "expo-router"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"

export default function RoutingHeader() {
    const pathname = usePathname()
    const rootName = pathname.replace("/folder", "/root")
    const theme = useAtomValue(themeAtom)

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[FontStyles.SubTitle, { color: theme.text }]} numberOfLines={3} ellipsizeMode='middle'>
                현재 경로: {rootName}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12
    }
})
