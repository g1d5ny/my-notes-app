import { useState } from "react"
import { StyleSheet, useColorScheme } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import AppBar from "../components/AppBar"
import { DarkTheme, LightTheme } from "../constants/Theme"
import { ThemeContext } from "../contexts/ThemeContext"
import { ThemeColorPalette } from "../types"
import FolderScreen from "./[...Path]"

export default function Index() {
    const scheme = useColorScheme()
    const currentTheme = scheme === "dark" ? DarkTheme : LightTheme
    const [theme, setTheme] = useState<ThemeColorPalette>(currentTheme)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
                <AppBar />
                <FolderScreen />
            </SafeAreaView>
        </ThemeContext.Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})
