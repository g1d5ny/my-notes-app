import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Pressable, StyleSheet, View } from "react-native"
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
    anchor: React.ReactNode
    list: OptionMenuList[]
}
export const OptionMenu = ({ anchor, list }: OptionMenuProps) => {
    const { theme } = useContext(ThemeContext)
    const [menuVisible, setMenuVisible] = useState(false)
    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    return (
        <Menu visible={menuVisible} onDismiss={closeMenu} anchor={<Pressable onPress={openMenu}>{anchor}</Pressable>} contentStyle={[styles.contentStyle, { backgroundColor: theme.background }]}>
            {list.map((item, index) => {
                return (
                    <View key={index}>
                        <Menu.Item
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
