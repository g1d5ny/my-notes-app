import { usePathname } from "expo-router"
import { Text, View } from "react-native"

export default function FolderScreen() {
    const pathname = usePathname()
    const pathArray = Array.isArray(pathname) ? pathname : pathname ? [pathname] : []

    return (
        <View>
            <Text>📁 현재 폴더 경로: {pathArray.join("/")}</Text>
        </View>
    )
}
