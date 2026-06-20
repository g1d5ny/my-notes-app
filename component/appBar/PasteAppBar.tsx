import { AndroidBack, Close, IosBack } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { appBarAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, SelectedMemoType } from "@/type"
import { usePathname, useRouter } from "expo-router"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"

export const PasteAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const router = useRouter()
    const pathname = usePathname()
    const [canBack, setCanBack] = useState(pathname.split("/").length > 2)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const count = selectedMemo.memo.length

    const cancel = () => {
        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
        setAppBar(AppBar.MAIN)
    }

    useEffect(() => {
        setCanBack(pathname.split("/").length > 2)
    }, [pathname])

    return (
        <View style={styles.row}>
            {canBack ? (
                <Pressable hitSlop={10} onPress={() => router.back()}>
                    {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
                </Pressable>
            ) : (
                <View style={styles.spacer} />
            )}
            <Text style={[FontStyles.SubTitle, { color: theme.text }]}>{count > 0 ? `${count}개 선택` : "붙여넣기"}</Text>
            <Pressable hitSlop={10} onPress={cancel}>
                <Close theme={theme} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    spacer: {
        width: 24
    }
})
