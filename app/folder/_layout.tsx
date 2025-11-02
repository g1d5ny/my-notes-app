import { ThemeContext } from "@/context/ThemeContext"
import { Stack } from "expo-router"
import { useContext } from "react"

export default function FolderLayout() {
    const { theme } = useContext(ThemeContext)

    return (
        <Stack
            screenOptions={{
                animation: "slide_from_right",
                animationDuration: 100,
                headerShown: false,
                animationTypeForReplace: "push",
                gestureEnabled: true,
                contentStyle: { backgroundColor: theme.background }
            }}
        />
        // <View style={{ padding: 20 }}>
        //     <Text>📂 여긴 루트 폴더입니다</Text>
        //     <TouchableOpacity onPress={() => router.push("/folder/1")}>
        //         <Text>폴더1로 이동하기</Text>
        //     </TouchableOpacity>
        // </View>
    )
}
