import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { usePathname } from "expo-router"
import { useContext } from "react"
import { Text, View } from "react-native"

export default function RoutingHeader() {
    const pathname = usePathname()
    const { theme } = useContext(ThemeContext)

    return (
        <View>
            <Text style={[FontStyles.SubTitle, { color: theme.text }]}>현재 경로: {pathname}</Text>
        </View>
    )
}
