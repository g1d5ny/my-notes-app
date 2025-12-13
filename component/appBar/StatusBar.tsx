import { LightTheme } from "@/constant/Theme"
import { schemeAtom, themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StatusBar as RNStatusBar } from "react-native"

export const StatusBar = () => {
    const scheme = useAtomValue(schemeAtom)
    const theme = useAtomValue(themeAtom)
    console.log("scheme: ", scheme, theme === LightTheme)

    const barStyle = () => {
        return scheme === "dark" ? "light-content" : "dark-content"
    }

    return <RNStatusBar barStyle={barStyle()} />
}
