import { Slot, useRouter } from "expo-router"

export default function FolderLayout() {
    const router = useRouter()

    return (
        <Slot />
        // <View style={{ padding: 20 }}>
        //     <Text>📂 여긴 루트 폴더입니다</Text>
        //     <TouchableOpacity onPress={() => router.push("/folder/1")}>
        //         <Text>폴더1로 이동하기</Text>
        //     </TouchableOpacity>
        // </View>
    )
}
