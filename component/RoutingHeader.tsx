import { FontStyles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { MemoType } from "@/type"
import { useGlobalSearchParams, usePathname } from "expo-router"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"

export default function RoutingHeader() {
    const pathname = usePathname()
    const rootName = pathname.replace("/folder", "").replace(/^\//, "/")
    const theme = useAtomValue(themeAtom)
    const params = useGlobalSearchParams()

    if (params.type === MemoType.FILE) {
        return <View />
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[FontStyles.Body, { color: "rgb(146, 135, 135)" }]} numberOfLines={3} ellipsizeMode='middle'>
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
