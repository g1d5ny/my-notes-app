import { ResetOption, SortOption, ThemeOption } from "@/assets/icons/svg/option/icon"
import { FontStyles } from "@/constant/Style"
import { DarkTheme, isSameTheme, LightTheme } from "@/constant/Theme"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { useSort } from "@/hook/useSort"
import { modalAtom, schemeAtom, sortAtom, themeAtom } from "@/store"
import { SortType } from "@/type"
import { useGlobalSearchParams } from "expo-router"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { Image, StyleSheet, Text } from "react-native"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

export const SettingOption = () => {
    const [theme, setTheme] = useAtom(themeAtom)
    const setScheme = useSetAtom(schemeAtom)
    const setModalVisible = useSetAtom(modalAtom)
    const sort = useAtomValue(sortAtom)
    const params = useGlobalSearchParams()
    const parentId = params.parentId ? Number(params.parentId) : null
    const { resetMemo } = useDeleteMemo()
    const { sortCreatedAt, sortUpdatedAt, sortTitle } = useSort()
    const [menuVisible, setMenuVisible] = useState(false)

    const mainOptionList: OptionMenuList[] = [
        // {
        //     title: "선택",
        //     trailingIcon: <CheckOption theme={theme} />,
        //     disabled: false,
        //     onPress: () => {
        //         setMenuVisible(false)
        //     },
        //     dividerWidth: 2,
        //     hasDivider: true
        // },
        {
            title: "정렬",
            trailingIcon: <SortOption theme={theme} />,
            disabled: true,
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "생성 시간 순",
            leadingIcon: sort === SortType.CREATED_AT ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                sortCreatedAt()
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "수정 시간 순",
            leadingIcon: sort === SortType.UPDATED_AT ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                sortUpdatedAt()
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "제목 순",
            leadingIcon: sort === SortType.TITLE ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                sortTitle()
                setMenuVisible(false)
            },
            dividerWidth: 1,
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
            leadingIcon: isSameTheme(theme, LightTheme) ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                setTheme(LightTheme)
                setScheme("light")
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "다크 모드",
            leadingIcon: isSameTheme(theme, DarkTheme) ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>,
            disabled: false,
            onPress: () => {
                setTheme(DarkTheme)
                setScheme("dark")
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
                setModalVisible({
                    visible: true,
                    message: "정말 초기화하시겠습니까?",
                    onConfirm: () => resetMemo({ parentId }),
                    confirmText: "초기화"
                })
                setMenuVisible(false)
            },
            hasDivider: false
        }
    ]

    return <OptionMenu list={mainOptionList} menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24
    }
})
