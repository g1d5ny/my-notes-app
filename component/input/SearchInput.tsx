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

    const animatedStyle = useAnimatedStyle(() => {
        "worklet"
        return {
            height: visibility.value * 64,
            paddingHorizontal: visibility.value * 16,
            paddingVertical: visibility.value * 6,
            gap: visibility.value * 8,
            flexDirection: "row" as const,
            transform: [{ translateX: (visibility.value - 1) * width }],
            overflow: "hidden" as const
        }
    }, [width])

    return (
        // 바깥 Animated.View는 overflow:hidden + transform 때문에 Fabric이 불투명 오프스크린 레이어를
        // 강제 생성하는데, 거기에 backgroundColor를 직접 주면 두 가지 문제가 있었다:
        // 1) Reanimated가 관리하는 뷰라 정적 backgroundColor가 테마 토글 시 Fabric에 다시 push되지 않아
        //    이전 테마색(검은/흰 띠)이 남았고, key로 remount해 우회하면
        // 2) remount된 새 레이어 버퍼가 흰색 → 첫 오픈에서 backgroundColor가 칠해지기 전 흰 깜빡임이 났다.
        // 그래서 Animated.View 자체는 투명하게 두고, 그 안에 "일반 View"(absoluteFill)로 theme.background를
        // 깐다. 일반 View는 Reanimated 간섭·remount 없이 React 커밋으로 색이 갱신되므로 토글 시 즉시 따라가고
        // (stale 띠 없음), 흰 레이어 버퍼를 항상 덮으며(흰 패딩 없음), remount가 없으니 깜빡임도 없다.
        <Animated.View collapsable={false} style={animatedStyle}>
            <View pointerEvents='none' style={[StyleSheet.absoluteFill, { backgroundColor: theme.background }]} />
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
