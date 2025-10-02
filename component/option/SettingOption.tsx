import { AndroidDots, IosDots } from "@/assets/icons/svg/icon"
import { CheckOption, ResetOption, SortOption, ThemeOption } from "@/assets/icons/svg/option/icon"
import { FontStyles } from "@/constant/Style"
import { DarkTheme, LightTheme } from "@/constant/Theme"
import { ThemeContext } from "@/context/ThemeContext"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { Image, Platform, StyleSheet, Text } from "react-native"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

interface SettingOptionProps {
    setResetModalVisible: Dispatch<SetStateAction<boolean>>
}
export const SettingOption = ({ setResetModalVisible }: SettingOptionProps) => {
    const { theme, currentScheme, setTheme, setCurrentScheme } = useContext(ThemeContext)
    const [menuVisible, setMenuVisible] = useState(false)

    const mainOptionList: OptionMenuList[] = [
        {
            title: "선택",
            trailingIcon: <CheckOption theme={theme} />,
            disabled: false,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 2,
            hasDivider: true
        },
        {
            title: "정렬",
            trailingIcon: <SortOption theme={theme} />,
            disabled: true,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "생성 시간 순",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "수정 시간 순",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "제목 순",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "자유 배치",
            leadingIcon: <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />,
            disabled: false,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 2,
            hasDivider: true
        },
        {
            title: "테마",
            trailingIcon: <ThemeOption theme={theme} />,
            disabled: true,
            onPress: () => {
                setMenuVisible(false)
            },
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
                setMenuVisible(false)
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
                setMenuVisible(false)
            },
            dividerWidth: 2,
            hasDivider: true
        },
        {
            title: "버전 정보",
            trailingIcon: <Text style={[FontStyles.ButtonText2, { color: theme.text }]}>1.0</Text>,
            disabled: true,
            onPress: () => {
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "데이터 초기화",
            trailingIcon: <ResetOption theme={theme} />,
            disabled: false,
            onPress: () => {
                setResetModalVisible(true)
                setMenuVisible(false)
            },
            hasDivider: false
        }
    ]

    const Dots = () => {
        return Platform.OS === "android" ? <AndroidDots theme={theme} /> : <IosDots theme={theme} />
    }

    return <OptionMenu anchor={<Dots />} list={mainOptionList} menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24
    }
})
