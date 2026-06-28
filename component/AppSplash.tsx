import * as SplashScreen from "expo-splash-screen"
import { useCallback, useEffect } from "react"
import { Image, StyleSheet, useWindowDimensions } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated"

// 풀 디자인(아이콘+타이틀+부제) 스플래시. Android 12+는 시스템 스플래시가 가운데 아이콘만
// 강제하므로, 네이티브 스플래시는 노랑 배경만 짧게 깔고 그 위에 이 이미지를 덮어 텍스트까지 보이게 한다.
const splashImage = require("../assets/images/splash.png")

// 스플래시 배경(크림). 이미지가 덮기 전/레터박스에 흰색·노랑이 비치지 않도록 네이티브 스플래시 배경과 동일.
const BG = "#f6ebd4"

const SHOW_MS = 900
const FADE_MS = 400

export const AppSplash = ({ onFinish }: { onFinish: () => void }) => {
    const opacity = useSharedValue(1)
    // 화면 크기를 명시해 이미지가 원본 크기(좌상단 기준)로 렌더되지 않고 화면을 꽉 채우게 한다.
    const { width, height } = useWindowDimensions()

    // 인앱 스플래시가 화면을 덮은 직후 네이티브 스플래시를 내린다(빈 화면 노출 방지).
    const onLayout = useCallback(() => {
        SplashScreen.hideAsync().catch(() => {})
    }, [])

    useEffect(() => {
        // 잠깐 보여준 뒤 부드럽게 사라지고, 끝나면 부모가 언마운트하도록 알린다.
        opacity.value = withDelay(
            SHOW_MS,
            withTiming(0, { duration: FADE_MS }, finished => {
                if (finished) runOnJS(onFinish)()
            })
        )
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

    return (
        <Animated.View pointerEvents='none' onLayout={onLayout} style={[StyleSheet.absoluteFill, styles.container, animatedStyle]}>
            <Image source={splashImage} resizeMode='cover' style={{ width, height }} />
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        backgroundColor: BG
    }
})
