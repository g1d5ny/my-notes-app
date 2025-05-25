import { usePathname } from "expo-router"
import { Text, View } from "react-native"

export default function RoutingHeader() {
    const pathname = usePathname()

    return (
        <View>
            <Text>현재 경로: {pathname}</Text>
        </View>
    )
}
