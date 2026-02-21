import { Search } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
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
            paddingVertical: visibility.value * 12,
            gap: visibility.value * 8,
            flexDirection: "row" as const,
            transform: [{ translateX: (visibility.value - 1) * width }],
            overflow: "hidden" as const
        }
    }, [width])

    return (
        <Animated.View style={animatedStyle}>
            <View style={[styles.inputContainer, { borderColor: theme.border }]}>
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
        height: 40,
        borderRadius: 8,
        borderWidth: 2,
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    input: {
        flex: 1,
        textAlign: "left"
    }
})
