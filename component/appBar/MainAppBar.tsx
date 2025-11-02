import { AndroidBack, Close, IosBack, Search } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { usePathname, useRouter } from "expo-router"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native"
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"
import { FontStyles, Styles } from "../../constant/Style"
import { SettingOption } from "../option/SettingOption"
import { AppBarForm } from "./AppBarForm"

interface MainAppBarProps {
    setResetModalVisible: Dispatch<SetStateAction<boolean>>
}
export const MainAppBar = ({ setResetModalVisible }: MainAppBarProps) => {
    const { theme } = useContext(ThemeContext)
    const router = useRouter()
    const pathname = usePathname()
    const lastPathname = pathname.split("/").pop()
    const [canBack, setCanBack] = useState(pathname.split("/").length > 2)
    const { width } = useWindowDimensions()
    const translateX = useSharedValue(-width) // 초기값을 화면 너비만큼 밖으로 설정

    const isInputVisible = useDerivedValue(() => {
        return translateX.value > -width
    })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            display: isInputVisible.value ? "flex" : "none",
            transform: [{ translateX: translateX.value }]
        }
    }, [])

    useEffect(() => {
        setCanBack(pathname.split("/").length > 2)
    }, [pathname])

    return (
        <>
            <AppBarForm>
                <View style={[Styles.row, styles.left]}>
                    {canBack && (
                        <>
                            <Pressable style={styles.back} onPress={() => router.back()}>
                                {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
                            </Pressable>
                            <Text style={[styles.lastPathname, { color: theme.text }]} numberOfLines={1} ellipsizeMode='tail'>
                                {lastPathname}
                            </Text>
                        </>
                    )}
                </View>
                <View style={[Styles.row, styles.right]}>
                    <Pressable onPress={() => (translateX.value = withTiming(0, { duration: 300 }))}>
                        <Search theme={theme} />
                    </Pressable>
                    <SettingOption setResetModalVisible={setResetModalVisible} />
                </View>
            </AppBarForm>
            {/* TODO: 나중에 페이지로 코드 분리 필요 */}
            <Animated.View style={[Styles.row, styles.container, animatedStyle]}>
                <Pressable onPress={() => (translateX.value = withTiming(-width, { duration: 300 }))}>
                    <Close theme={theme} />
                </Pressable>
                <View style={[styles.inputContainer, { borderColor: theme.border }]}>
                    <Search theme={theme} />
                    <TextInput style={[styles.input, FontStyles.BodySmall, { color: theme.text }]} placeholder='검색하기' placeholderTextColor={theme.gray} />
                </View>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    lastPathname: {
        ...FontStyles.SubTitle,
        flex: 1,
        marginHorizontal: 8
    },
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
        textAlign: "center"
    },
    back: {
        alignSelf: "flex-start"
    },
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    },
    left: {
        flex: 1
    },
    container: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 8,
        marginTop: 16
    }
})
