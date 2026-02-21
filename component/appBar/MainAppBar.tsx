import { AndroidBack, IosBack, Search } from "@/assets/icons/svg/icon"
import { searchInputAtom, themeAtom } from "@/store"
import { usePathname, useRouter } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { FontStyles, Styles } from "../../constant/Style"
import { SettingOption } from "../option/SettingOption"

export const MainAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const setSearchInput = useSetAtom(searchInputAtom)
    const router = useRouter()
    const pathname = usePathname()
    const lastPathname = pathname.split("/").pop()

    return (
        <>
            <View style={[Styles.row, styles.left]}>
                {pathname.split("/").length > 2 && (
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
                <Pressable onPress={() => setSearchInput(prev => ({ value: "", visible: !prev.visible }))}>
                    <Search theme={theme} />
                </Pressable>
                <SettingOption />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    lastPathname: {
        ...FontStyles.SubTitle,
        flex: 1,
        marginHorizontal: 8
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
    }
})
