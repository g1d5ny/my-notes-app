import { ThemeContext } from "@/context/ThemeContext"
import { Stack } from "expo-router"
import { useContext } from "react"

export default function FolderLayout() {
    const { theme } = useContext(ThemeContext)

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
