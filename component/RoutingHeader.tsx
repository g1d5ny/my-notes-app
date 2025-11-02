import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { usePathname } from "expo-router"
import { useContext } from "react"
import { StyleSheet, Text, View } from "react-native"

export default function RoutingHeader() {
    const pathname = usePathname()
    const { theme } = useContext(ThemeContext)

    return (
        <View style={styles.container}>
            <Text style={[FontStyles.SubTitle, { color: theme.text }]}>현재 경로: {pathname}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12
    }
})
