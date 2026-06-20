import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, useWindowDimensions } from "react-native"
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg"

/**
 * 다크↔라이트 전환을 부드럽게.
 * 바뀌는 프레임에 "이전 배경색" 오버레이를 같이 띄워(useLayoutEffect) 색 교체 깜빡임을 가리고,
 * 사선 그라데이션 + opacity 페이드로 새 테마가 사선으로 "샤아악" 드러나게 한다.
 */
export const ThemeTransition = () => {
    const theme = useAtomValue(themeAtom)
    const { width, height } = useWindowDimensions()
    const prevBg = useRef(theme.background)
    const [overlay, setOverlay] = useState<string | null>(null)
    const progress = useSharedValue(0)

    useLayoutEffect(() => {
        if (prevBg.current === theme.background) return
        setOverlay(prevBg.current)
        prevBg.current = theme.background
        progress.value = 0
        progress.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) }, finished => {
            if (finished) runOnJS(setOverlay)(null)
        })
    }, [theme.background, progress])

    const style = useAnimatedStyle(() => ({ opacity: 1 - progress.value }))

    if (!overlay) {
        return null
    }

    return (
        <Animated.View pointerEvents='none' style={[StyleSheet.absoluteFill, style]}>
            <Svg width={width} height={height}>
                <Defs>
                    {/* 좌상단은 꽉 차고 우하단으로 갈수록 옅어져 → 사선으로 드러남 */}
                    <LinearGradient id='themeWipe' x1='0' y1='0' x2='1' y2='1'>
                        <Stop offset='0' stopColor={overlay} stopOpacity='1' />
                        <Stop offset='0.65' stopColor={overlay} stopOpacity='1' />
                        <Stop offset='1' stopColor={overlay} stopOpacity='0.55' />
                    </LinearGradient>
                </Defs>
                <Rect width={width} height={height} fill='url(#themeWipe)' />
            </Svg>
        </Animated.View>
    )
}
