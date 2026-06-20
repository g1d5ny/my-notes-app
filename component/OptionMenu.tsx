import { AndroidDots, IosDots } from "@/assets/icons/svg/icon"
import { Elevation, FontStyles, Radius, Spacing } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { Dispatch, SetStateAction } from "react"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { Divider, Menu } from "react-native-paper"

const DANGER = "#FF3B30"

export interface OptionMenuList {
    title: string
    trailingIcon?: React.JSX.Element
    leadingIcon?: React.JSX.Element
    disabled?: boolean
    onPress?: () => void
    dividerWidth?: number
    hasDivider: boolean
    /** 섹션 라벨(정렬·테마 등) — 작은 보조 캡션으로 표시, 탭 불가 */
    isSection?: boolean
    /** 위험 동작(데이터 초기화 등) — 빨강 */
    destructive?: boolean
}

interface OptionMenuProps {
    list: OptionMenuList[]
    menuVisible: boolean
    setMenuVisible: Dispatch<SetStateAction<boolean>>
}
export const OptionMenu = ({ list, menuVisible, setMenuVisible }: OptionMenuProps) => {
    const theme = useAtomValue(themeAtom)
    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const Dots = () => {
        return Platform.OS === "android" ? <AndroidDots theme={theme} /> : <IosDots theme={theme} />
    }

    return (
        <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<Pressable onPress={openMenu}>{<Dots />}</Pressable>} contentStyle={[styles.contentStyle, Elevation.medium, { backgroundColor: theme.surface }]}>
            {list.map((item, index) => {
                // 섹션 라벨 — 일반 항목과 구분되는 작은 캡션
                if (item.isSection) {
                    return (
                        <View key={index} style={styles.section}>
                            <Text style={[FontStyles.Caption, { color: theme.textSecondary }]}>{item.title}</Text>
                            {item.trailingIcon}
                        </View>
                    )
                }

                const titleColor = item.destructive ? DANGER : theme.text
                return (
                    <View key={index}>
                        <Menu.Item
                            disabled={item.disabled}
                            onPress={item.onPress}
                            title={item.title}
                            trailingIcon={() => item?.trailingIcon}
                            {...(item.leadingIcon && { leadingIcon: () => item.leadingIcon })}
                            style={styles.menuItem}
                            titleStyle={[FontStyles.ButtonText2, { color: titleColor }]}
                            containerStyle={styles.containerStyle}
                        />
                        {/* 그룹 경계에서만 hairline 구분선 (줄마다 X) */}
                        {item.dividerWidth === 2 && <Divider style={[styles.divider, { backgroundColor: theme.border }]} />}
                    </View>
                )
            })}
        </Menu>
    )
}

const styles = StyleSheet.create({
    containerStyle: {
        justifyContent: "space-between"
    },
    contentStyle: {
        borderRadius: Radius.md,
        paddingVertical: Spacing.xs
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.xs
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        marginVertical: Spacing.xs
    },
    menuItem: {
        height: 44
    }
})
