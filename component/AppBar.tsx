import { HorizontalDots, Search, VerticalDots } from "@/assets/icons/svg/icon"
import { CheckOption, ResetOption, SortOption, ThemeOption } from "@/assets/icons/svg/option/icon"
import { DarkTheme, LightTheme } from "@/constant/Theme"
import { useContext, useState } from "react"
import { Image, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { Divider, Menu } from "react-native-paper"
import { FontStyles, Styles } from "../constant/Style"
import { ThemeContext } from "../context/ThemeContext"

export default function AppBar() {
    const { theme, currentScheme, setCurrentScheme, setTheme } = useContext(ThemeContext)

    const Dots = () => {
        return Platform.OS === "android" ? <VerticalDots theme={theme} /> : <HorizontalDots theme={theme} />
    }

    const OptionMenu = () => {
        const [menuVisible, setMenuVisible] = useState(false)
        const openMenu = () => setMenuVisible(true)
        const closeMenu = () => setMenuVisible(false)

        return (
            <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                    <Pressable onPress={openMenu}>
                        <Dots />
                    </Pressable>
                }
                contentStyle={[styles.contentStyle, { backgroundColor: theme.background }]}
            >
                <Menu.Item onPress={() => {}} title='선택' trailingIcon={() => <CheckOption theme={theme} />} style={styles.menuItem} titleStyle={[FontStyles.ButtonText2, { color: theme.text }]} containerStyle={styles.containerStyle} />
                <Divider style={[styles.thickDivider, { backgroundColor: theme.border }]} />
                <Menu.Item disabled title='정렬' trailingIcon={() => <SortOption theme={theme} />} style={styles.menuItem} titleStyle={[FontStyles.ButtonText2, { color: theme.text }]} containerStyle={styles.containerStyle} />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {}}
                    title='생성 시간 순'
                    leadingIcon={() => <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={styles.containerStyle}
                />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {}}
                    title='수정 시간 순'
                    leadingIcon={() => <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={styles.containerStyle}
                />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {}}
                    title='제목 순'
                    leadingIcon={() => <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={styles.containerStyle}
                />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {}}
                    title='자유 배치'
                    leadingIcon={() => <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} />}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={styles.containerStyle}
                />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item disabled title='테마' trailingIcon={() => <ThemeOption theme={theme} />} style={styles.menuItem} titleStyle={[FontStyles.ButtonText2, { color: theme.text }]} containerStyle={styles.containerStyle} />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {
                        setCurrentScheme("light")
                        setTheme(LightTheme)
                    }}
                    title='라이트 모드'
                    leadingIcon={() => {
                        return currentScheme === "light" ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>
                    }}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={styles.containerStyle}
                />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {
                        setCurrentScheme("dark")
                        setTheme(DarkTheme)
                    }}
                    title='다크 모드'
                    leadingIcon={() => {
                        return currentScheme === "dark" ? <Image source={require("@/assets/icons/icon_selected.png")} style={styles.icon} /> : <></>
                    }}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                />
                <Divider style={[styles.thickDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    disabled
                    title='버전 정보'
                    trailingIcon={() => <Text style={[FontStyles.ButtonText2, { color: theme.text }]}>1.0</Text>}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={[styles.containerStyle]}
                />
                <Divider style={[styles.thinDivider, { backgroundColor: theme.border }]} />
                <Menu.Item
                    onPress={() => {}}
                    title='데이터 초기화'
                    trailingIcon={() => <ResetOption theme={theme} />}
                    style={styles.menuItem}
                    titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                    containerStyle={[styles.containerStyle, {}]}
                />
            </Menu>
        )
    }

    return (
        <View style={[Styles.row, styles.container, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <View style={styles.left} />
            <View style={[Styles.row, styles.right]}>
                <Pressable>
                    <Search theme={theme} />
                </Pressable>
                <OptionMenu />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "space-between"
    },
    contentStyle: {
        borderRadius: 10
    },
    thickDivider: {
        height: 2
    },
    thinDivider: {
        height: 1
    },
    menuItem: {
        height: 40,
        paddingHorizontal: 16
    },
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
