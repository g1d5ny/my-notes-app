import { Search } from "@/assets/icons/svg/icon"
import { FontStyles, Radius } from "@/constant/Style"
import { searchInputAtom, themeAtom } from "@/store"
import { useAtom, useAtomValue } from "jotai"
import { useCallback } from "react"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, TextInput, useWindowDimensions, View } from "react-native"
import Animated, { runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

const ANIMATION_DURATION = 300

type FormValues = {
    search: string
}

export const SearchInput = () => {
    const theme = useAtomValue(themeAtom)
    const [searchInput, setSearchInput] = useAtom(searchInputAtom)
    const { width } = useWindowDimensions()
    const { control, resetField, setFocus } = useForm<FormValues>({ defaultValues: { search: "" } })

    const visibility = useSharedValue(0)

    const onAnimationEnd = useCallback((visible: boolean) => {
        if (visible) {
            setFocus("search")
        } else {
            resetField("search")
            Keyboard.dismiss()
        }
    }, [])

    useAnimatedReaction(
        () => searchInput.visible,
        target => {
            visibility.value = withTiming(target ? 1 : 0, { duration: ANIMATION_DURATION }, finished => {
                if (finished) runOnJS(onAnimationEnd)(target)
            })
        }
    )

    // 바깥 컨테이너: 높이·패딩만 애니메이션(translateX 없음). 슬라이드 중에도 항상 행 전체 너비를 덮는다.
    const containerStyle = useAnimatedStyle(() => {
        "worklet"
        return {
            height: visibility.value * 64,
            paddingHorizontal: visibility.value * 16,
            paddingVertical: visibility.value * 6,
            gap: visibility.value * 8,
            flexDirection: "row" as const,
            overflow: "hidden" as const
        }
    })

    // 슬라이드는 pill에만 건다. 바깥이 아니라 pill이 translate되므로, 바깥 백드롭이 노출되는 빈 영역이 없다.
    const pillStyle = useAnimatedStyle(() => {
        "worklet"
        return {
            flex: 1,
            transform: [{ translateX: (visibility.value - 1) * width }]
        }
    }, [width])

    return (
        // 바깥 Animated.View는 height만 애니메이션하고 translate하지 않으므로 슬라이드 중에도 행 전체 너비를
        // 덮는다. 그 위에 absoluteFill 일반 View로 theme.background를 깔아 — 새로 열리는 레이아웃 띠가
        // 칠해지기 전 흰색으로 비치는 걸 막는다. 일반 View라 Reanimated 간섭·remount 없이 React 커밋으로
        // 색이 갱신돼 테마 토글을 즉시 따라간다(stale 띠 없음).
        // 슬라이드(translateX)는 안쪽 pill에만 건다. 예전엔 바깥을 translate해서, 슬라이드 도중 바깥이 행의
        // 왼쪽 일부만 덮고 오른쪽엔 미페인트 영역이 흰 띠로 떴다. pill만 움직이면 백드롭이 늘 행을 다 덮는다.
        <Animated.View collapsable={false} style={containerStyle}>
            <View pointerEvents='none' style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />
            <Animated.View style={pillStyle}>
                <View collapsable={false} style={[styles.inputContainer, { backgroundColor: theme.surfaceVariant }]}>
                    <Search theme={theme} />
                    <Controller
                        control={control}
                        name='search'
                        render={({ field: { onChange, value, ref } }) => (
                            <TextInput
                                ref={ref}
                                value={value}
                                onChangeText={text => {
                                    onChange(text)
                                    setSearchInput(prev => ({ ...prev, value: text }))
                                }}
                                returnKeyType='search'
                                style={[styles.input, FontStyles.BodySmall, { color: theme.text }]}
                                placeholder='검색하기'
                                placeholderTextColor={theme.gray}
                            />
                        )}
                    />
                </View>
            </Animated.View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        // 세로 여유가 부족하면 한글 글리프가 위아래로 잘려 placeholder/입력값이 점·대시처럼 깨져 보인다.
        // (바깥 Animated.View 높이 64 - 패딩에서 남는 공간이 빠듯했던 게 원인) minHeight·패딩으로 여유 확보.
        minHeight: 44,
        borderRadius: Radius.md,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4
    },
    input: {
        flex: 1,
        textAlign: "left"
    }
})
