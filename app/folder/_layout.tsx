import { themeAtom } from "@/store"
import { Stack } from "expo-router"
import { useAtomValue } from "jotai"

export default function FolderLayout() {
    const theme = useAtomValue(themeAtom)

    return (
        <Stack
            screenOptions={{
                animation: "slide_from_right",
                headerShown: false,
                animationTypeForReplace: "push",
                gestureEnabled: true,
                contentStyle: { backgroundColor: theme.background }
            }}
        />
    )
}
