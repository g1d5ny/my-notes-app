import { schemeAtom } from "@/store"
import { StatusBar as ExpoStatusBar } from "expo-status-bar"
import { useAtomValue } from "jotai"

export const StatusBar = () => {
    const scheme = useAtomValue(schemeAtom)

    // edge-to-edge에선 RNStatusBar의 barStyle/backgroundColor가 안 먹어 아이콘색이 시스템을 따라간다.
    // expo-status-bar로 "앱 내부 테마(scheme)" 기준 아이콘색을 정한다(다크=흰 글씨, 라이트=검은 글씨).
    // 배경색은 _layout의 SystemUI.setBackgroundColorAsync가 담당.
    return <ExpoStatusBar style={scheme === "dark" ? "light" : "dark"} />
}
