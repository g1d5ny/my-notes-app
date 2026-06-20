import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { useLayoutEffect, useRef, useState } from "react"
import { StyleSheet, useWindowDimensions } from "react-native"
import Animated, { Easing, runOnJS, useAnimatedProps, useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg"

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

/**
 * 다크↔라이트 전환을 "가운데서 퍼지는" 원형 리빌로 처리.
 * 전환 순간 화면 전체를 이전 배경색으로 덮고(useLayoutEffect, 즉시 색 교체를 가림),
 * 가운데서 원형 구멍이 커지며 그 아래의 새 테마가 중앙→가장자리로 드러난다. (휙~)
 */
export const ThemeTransition = () => {
    const theme = useAtomValue(themeAtom)
    const { width, height } = useWindowDimensions()
    const prevBg = useRef(theme.background)
    const [overlay, setOverlay] = useState<string | null>(null)
    const progress = useSharedValue(0)

    // 화면 모서리까지 덮으려면 중심에서 모서리까지 거리가 최대 반지름.
    const maxR = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2)

    useLayoutEffect(() => {
        if (prevBg.current === theme.background) return
        setOverlay(prevBg.current)
        prevBg.current = theme.background
        progress.value = 0
        progress.value = withTiming(1, { duration: 460, easing: Easing.out(Easing.cubic) }, finished => {
            if (finished) runOnJS(setOverlay)(null)
        })
    }, [theme.background, progress])

    const circleProps = useAnimatedProps(() => ({ r: progress.value * maxR }))

    if (!overlay) {
        return null
    }

    return (
        <Animated.View pointerEvents='none' style={StyleSheet.absoluteFill}>
            <Svg width={width} height={height}>
                <Defs>
                    {/* 흰색=이전 배경 보임, 검은색(가운데 원)=뚫려서 새 테마가 드러남 */}
                    <Mask id='themeReveal'>
                        <Rect x='0' y='0' width={width} height={height} fill='white' />
                        <AnimatedCircle cx={width / 2} cy={height / 2} animatedProps={circleProps} fill='black' />
                    </Mask>
                </Defs>
                <Rect x='0' y='0' width={width} height={height} fill={overlay} mask='url(#themeReveal)' />
            </Svg>
        </Animated.View>
    )
}
