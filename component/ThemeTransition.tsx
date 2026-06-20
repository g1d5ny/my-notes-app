import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet } from "react-native"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

/**
 * 다크↔라이트 전환을 부드럽게.
 * 전환 순간 "이전 배경색"으로 화면 전체를 완전히 덮은(useLayoutEffect, opacity 1) 뒤,
 * 그 오버레이를 균일하게 서서히 사라지게 해(ease) 즉시 색 교체로 생기는 깜빡임을 가린다.
 * 모서리부터 반투명했던 사선 그라데이션을 없애 깜빡임 없이 "샤르륵" 디졸브된다.
 */
export const ThemeTransition = () => {
    const theme = useAtomValue(themeAtom)
    const prevBg = useRef(theme.background)
    const [overlay, setOverlay] = useState<string | null>(null)
    const progress = useSharedValue(0)

    useLayoutEffect(() => {
        if (prevBg.current === theme.background) return
        setOverlay(prevBg.current)
        prevBg.current = theme.background
        progress.value = 0
        progress.value = withTiming(1, { duration: 520, easing: Easing.inOut(Easing.ease) }, finished => {
            if (finished) runOnJS(setOverlay)(null)
        })
    }, [theme.background, progress])

    const style = useAnimatedStyle(() => ({ opacity: 1 - progress.value }))

    if (!overlay) {
        return null
    }

    return <Animated.View pointerEvents='none' style={[StyleSheet.absoluteFill, { backgroundColor: overlay }, style]} />
}
