import { AndroidBack, IosBack, Search } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { usePathname, useRouter } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, TextInput, useWindowDimensions, View } from "react-native"
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import { Color, FontStyles, Styles } from "../../constant/Style"
import { MessageModal } from "../modal/MessageModal"
import { SettingOption } from "../option/SettingOption"
import { AppBarForm } from "./AppBarForm"

const InputSearch = () => {
    return (
        <Svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <Path
                d='M9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C2.99933 7.684 3.62867 6.14667 4.888 4.888C6.14733 3.62933 7.68467 3 9.5 3C11.3153 3 12.853 3.62933 14.113 4.888C15.373 6.14667 16.002 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L20.3 18.9C20.4833 19.0833 20.575 19.3167 20.575 19.6C20.575 19.8833 20.4833 20.1167 20.3 20.3C20.1167 20.4833 19.8833 20.575 19.6 20.575C19.3167 20.575 19.0833 20.4833 18.9 20.3L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16ZM9.5 14C10.75 14 11.8127 13.5627 12.688 12.688C13.5633 11.8133 14.0007 10.7507 14 9.5C13.9993 8.24933 13.562 7.187 12.688 6.313C11.814 5.439 10.7513 5.00133 9.5 5C8.24867 4.99867 7.18633 5.43633 6.313 6.313C5.43967 7.18967 5.002 8.252 5 9.5C4.998 10.748 5.43567 11.8107 6.313 12.688C7.19033 13.5653 8.25267 14.0027 9.5 14Z'
                fill={"rgba(0, 0, 0, 0.6)"}
            />
        </Svg>
    )
}

const InputClose = () => {
    return (
        <Svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <Path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M12.0001 14.1221L17.3031 19.4251C17.5845 19.7065 17.9661 19.8646 18.3641 19.8646C18.762 19.8646 19.1437 19.7065 19.4251 19.4251C19.7065 19.1437 19.8646 18.7621 19.8646 18.3641C19.8646 17.9662 19.7065 17.5845 19.4251 17.3031L14.1201 12.0001L19.4241 6.69711C19.5634 6.55778 19.6738 6.39238 19.7492 6.21036C19.8245 6.02834 19.8633 5.83326 19.8632 5.63626C19.8632 5.43926 19.8243 5.2442 19.7489 5.06221C19.6735 4.88022 19.5629 4.71488 19.4236 4.57561C19.2843 4.43634 19.1189 4.32588 18.9368 4.25054C18.7548 4.17519 18.5597 4.13644 18.3627 4.13648C18.1657 4.13653 17.9707 4.17538 17.7887 4.25081C17.6067 4.32624 17.4414 4.43678 17.3021 4.57611L12.0001 9.87911L6.69709 4.57611C6.55879 4.43278 6.39333 4.31843 6.21036 4.23973C6.02739 4.16103 5.83058 4.11956 5.63141 4.11774C5.43224 4.11591 5.23471 4.15377 5.05033 4.22911C4.86595 4.30444 4.69842 4.41574 4.55752 4.55652C4.41661 4.69729 4.30515 4.86471 4.22964 5.04902C4.15414 5.23333 4.11609 5.43083 4.11773 5.63C4.11936 5.82917 4.16065 6.02602 4.23917 6.20906C4.3177 6.3921 4.43189 6.55767 4.57509 6.69611L9.88009 12.0001L4.57609 17.3041C4.43289 17.4425 4.3187 17.6081 4.24017 17.7912C4.16165 17.9742 4.12036 18.1711 4.11873 18.3702C4.11709 18.5694 4.15514 18.7669 4.23064 18.9512C4.30615 19.1355 4.41761 19.3029 4.55852 19.4437C4.69942 19.5845 4.86695 19.6958 5.05133 19.7711C5.23571 19.8464 5.43324 19.8843 5.63241 19.8825C5.83158 19.8807 6.02839 19.8392 6.21136 19.7605C6.39433 19.6818 6.55979 19.5674 6.69809 19.4241L12.0001 14.1221Z'
                fill={"rgba(0, 0, 0, 0.6)"}
            />
        </Svg>
    )
}
export const MainAppBar = () => {
    const { theme } = useContext(ThemeContext)
    const router = useRouter()
    const pathname = usePathname()
    const [resetModalVisible, setResetModalVisible] = useState(false)
    const [canBack, setCanBack] = useState(pathname.split("/").length > 2)
    const { width } = useWindowDimensions()
    const translateX = useSharedValue(-width) // 초기값을 화면 밖으로 설정

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
                <View style={styles.left}>
                    {canBack && (
                        <Pressable style={styles.back} onPress={() => router.back()}>
                            {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
                        </Pressable>
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
                    <InputClose />
                </Pressable>
                <View style={styles.inputContainer}>
                    <InputSearch />
                    <TextInput style={[styles.input, FontStyles.BodySmall]} placeholder='검색하기' placeholderTextColor={Color.cancel} />
                </View>
            </Animated.View>
            <MessageModal message={"데이터를 초기화하시겠습니까?"} visible={resetModalVisible} onDismiss={() => setResetModalVisible(false)} onConfirm={() => setResetModalVisible(false)} confirmText={"초기화"} />
        </>
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
        paddingVertical: 8,
        borderColor: "rgba(0, 0, 0, 0.6)"
    },
    input: {
        color: "rgba(0, 0, 0, 0.6)"
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
