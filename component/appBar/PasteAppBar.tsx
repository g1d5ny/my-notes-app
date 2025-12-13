import { AndroidBack, Close, IosBack, Paste } from "@/assets/icons/svg/icon"
import { Styles } from "@/constant/Style"
import { modalAtom, themeAtom } from "@/store"
import { usePathname, useRouter } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"

export const PasteAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const router = useRouter()
    const pathname = usePathname()
    const setModal = useSetAtom(modalAtom)
    const [canBack, setCanBack] = useState(pathname.split("/").length > 2)

    const paste = () => {
        Toast.show({
            text1: "붙여넣기 되었습니다.",
            type: "customToast",
            position: "bottom",
            visibilityTime: 5000
        })
    }

    const cancel = () => {
        setModal(prev => ({ ...prev, visible: true, message: "붙여넣기를 취소하시겠습니까?", onConfirm: () => {}, confirmText: "취소" }))
    }

    useEffect(() => {
        setCanBack(pathname.split("/").length > 2)
    }, [pathname])

    return (
        <View>
            <View style={styles.left}>
                {canBack && (
                    <Pressable style={styles.back} onPress={() => router.back()}>
                        {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
                    </Pressable>
                )}
            </View>
            <View style={[Styles.row, styles.right]}>
                <Pressable onPress={cancel}>
                    <Close theme={theme} />
                </Pressable>
                <Pressable onPress={paste}>
                    <Paste theme={theme} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
