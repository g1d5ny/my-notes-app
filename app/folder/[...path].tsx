import { usePathname, useRouter } from "expo-router"
import { Text, TouchableOpacity, View } from "react-native"

export default function FolderScreen() {
    const pathname = usePathname()
    const router = useRouter()
    const segments = pathname.split("/").filter(Boolean).slice(1)

    return (
        <View style={{ padding: 16 }}>
            <Text>📂 경로: /{segments.join("/")}</Text>
            <TouchableOpacity onPress={() => router.back()}>
                <Text>뒤로가기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 1, backgroundColor: "#faf" }} onPress={() => router.navigate(`/folder/${Number(segments.join("/")) + 1}`)}>
                <Text>폴더 {Number(segments.join("/")) + 1}로 이동하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ borderWidth: 1, backgroundColor: "#faf" }} onPress={() => {}}>
                <Text>내용 추가하기!</Text>
            </TouchableOpacity>
        </View>
    )
}
