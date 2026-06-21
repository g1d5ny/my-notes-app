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
        // key={theme.background}: Reanimated는 useAnimatedStyle 안의 color든 정적 style의 color든
        // 테마 변경 시 Fabric 네이티브 뷰에 다시 push하지 않아(특히 화면 밖으로 translate된 닫힌 상태)
        // 이전 테마색(검은/흰 띠)이 남는다. 테마가 바뀌면 remount해 새 배경색으로 다시 그린다.
        // (FolderList 제목의 key={theme.text}와 동일한 검증된 패턴.)
        // collapsable={false}는 height 0↔64로 레이어가 평탄화/재생성되며 생기는 깜빡임을 막는다.
        <Animated.View key={theme.background} collapsable={false} style={[animatedStyle, { backgroundColor: theme.background }]}>
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
