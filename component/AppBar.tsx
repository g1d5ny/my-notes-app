import { HorizontalDots, Search, VerticalDots } from "@/assets/icons/svg/icon"
import { CheckOption, ResetOption, SortOption, ThemeOption } from "@/assets/icons/svg/option/icon"
import { DarkTheme, LightTheme } from "@/constant/Theme"
import { useContext, useState } from "react"
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { FontStyles, Styles } from "../constant/Style"
import { ThemeContext } from "../context/ThemeContext"
import { MessageModal } from "./modal/MessageModal"
import { OptionMenu, OptionMenuList } from "./OptionMenu"

export default function AppBar() {
    const { theme, currentScheme, setTheme, setCurrentScheme } = useContext(ThemeContext)
    const [modalVisible, setModalVisible] = useState(false)

    const Dots = () => {
        return Platform.OS === "android" ? <VerticalDots theme={theme} /> : <HorizontalDots theme={theme} />
    }

    const OptionList: OptionMenuList[] = [
        {
            title: "선택",
            trailingIcon: <CheckOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 2,
            hasDivider: true
        },
        {
            title: "정렬",
            trailingIcon: <SortOption theme={theme} />,
            disabled: true,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "생성 시간 순",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "수정 시간 순",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "제목 순",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "자유 배치",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 2,
            hasDivider: true
        },
        {
            title: "테마",
            trailingIcon: <ThemeOption theme={theme} />,
            disabled: true,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "라이트 모드",
            leadingIcon: currentScheme === "light" ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                setCurrentScheme("light")
                setTheme(LightTheme)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "다크 모드",
            leadingIcon: currentScheme === "dark" ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                setCurrentScheme("dark")
                setTheme(DarkTheme)
            },
            dividerWidth: 2,
            hasDivider: true
        },
        {
            title: "버전 정보",
            trailingIcon: <Text style={[FontStyles.ButtonText2, { color: theme.text }]}>1.0</Text>,
            disabled: true,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "데이터 초기화",
            trailingIcon: <ResetOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            hasDivider: false
        }
    ]

    return (
        <>
            <View style={[Styles.row, styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
                <View style={styles.left} />
                <View style={[Styles.row, styles.right]}>
                    <Pressable onPress={() => setModalVisible(true)}>
                        <Search theme={theme} />
                    </Pressable>
                    <OptionMenu anchor={<Dots />} list={OptionList} />
                </View>
            </View>
            <MessageModal message='정말 삭제하시겠습니까?' visible={modalVisible} onDismiss={() => setModalVisible(false)} onConfirm={() => {}} />
        </>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24
    },
    left: {
        flex: 1
    },
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    },
    container: {
        width: "100%",
        paddingVertical: Platform.OS === "ios" ? 8 : 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1
    }
})
