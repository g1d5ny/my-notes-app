import { schemeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StatusBar as RNStatusBar } from "react-native"

export const StatusBar = () => {
    const scheme = useAtomValue(schemeAtom)

    const barStyle = () => {
        return scheme === "dark" ? "light-content" : "dark-content"
    }

    return <RNStatusBar barStyle={barStyle()} />
}
