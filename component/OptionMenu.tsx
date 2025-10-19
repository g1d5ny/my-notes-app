import { AndroidDots, IosDots } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { Dispatch, SetStateAction, useContext } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { Divider, Menu } from "react-native-paper"

export interface OptionMenuList {
    title: string
    trailingIcon?: React.JSX.Element
    leadingIcon?: React.JSX.Element
    disabled?: boolean
    onPress?: () => void
    dividerWidth?: number
    hasDivider: boolean
}

interface OptionMenuProps {
    list: OptionMenuList[]
    menuVisible: boolean
    setMenuVisible: Dispatch<SetStateAction<boolean>>
}
export const OptionMenu = ({ list, menuVisible, setMenuVisible }: OptionMenuProps) => {
    const { theme } = useContext(ThemeContext)
    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const Dots = () => {
        return Platform.OS === "android" ? <AndroidDots theme={theme} /> : <IosDots theme={theme} />
    }

    return (
        <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<Pressable onPress={openMenu}>{<Dots />}</Pressable>} contentStyle={[styles.contentStyle, { backgroundColor: theme.background }]}>
            {list.map((item, index) => {
                return (
                    <View key={index}>
                        <Menu.Item
                            disabled={item.disabled}
                            onPress={item.onPress}
                            title={item.title}
                            trailingIcon={() => {
                                return item?.trailingIcon
                            }}
                            {...(item.leadingIcon && {
                                leadingIcon: () => item.leadingIcon
                            })}
                            style={styles.menuItem}
                            titleStyle={[FontStyles.ButtonText2, { color: theme.text }]}
                            containerStyle={styles.containerStyle}
                        />
                        {item.hasDivider && <Divider style={[item.dividerWidth === 2 ? styles.thickDivider : styles.thinDivider, { backgroundColor: theme.border }]} />}
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
        borderRadius: 10
    },
    thickDivider: {
        height: 2
    },
    thinDivider: {
        height: 1
    },
    menuItem: {
        height: 40
        // paddingHorizontal: 16
    }
})
