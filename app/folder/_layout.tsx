import { themeAtom } from "@/store"
import { Stack } from "expo-router"
import { useAtomValue } from "jotai"
import { Platform } from "react-native"

export default function FolderLayout() {
    const theme = useAtomValue(themeAtom)

    return (
        <Stack
            screenOptions={{
                // iOS는 네이티브 푸시(앞 화면 패럴랙스 + 엣지 스와이프 백)를 그대로 사용,
                // 안드로이드는 Material 느낌의 우측 슬라이드.
                animation: Platform.OS === "ios" ? "default" : "slide_from_right",
                headerShown: false,
                animationTypeForReplace: "push",
                gestureEnabled: true,
                contentStyle: { backgroundColor: theme.background }
            }}
        />
    )
}
