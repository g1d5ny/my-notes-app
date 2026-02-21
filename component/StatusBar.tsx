import { schemeAtom, themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StatusBar as RNStatusBar } from "react-native"

export const StatusBar = () => {
    const scheme = useAtomValue(schemeAtom)
    const theme = useAtomValue(themeAtom)

    const barStyle = scheme === "light" ? "dark-content" : "light-content"

    return <RNStatusBar barStyle={barStyle} backgroundColor={theme.background} />
}
