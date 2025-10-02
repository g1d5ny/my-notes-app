import { AndroidBack, IosBack, Search } from "@/assets/icons/svg/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { usePathname, useRouter } from "expo-router"
import { useContext, useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { Styles } from "../../constant/Style"
import { MessageModal } from "../modal/MessageModal"
import { SettingOption } from "../option/SettingOption"
import { AppBarForm } from "./AppBarForm"

export const MainAppBar = () => {
    const { theme } = useContext(ThemeContext)
    const router = useRouter()
    const pathname = usePathname()
    const [pressed, setPressed] = useState(false)
    const [resetModalVisible, setResetModalVisible] = useState(false)
    const [canBack, setCanBack] = useState(pathname.split("/").length > 2)

    useEffect(() => {
        setCanBack(pathname.split("/").length > 2)
    }, [pathname])

    return (
        <>
            <AppBarForm>
                <View style={styles.left}>{canBack && <Pressable onPress={() => router.back()}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>}</View>
                <View style={[Styles.row, styles.right]}>
                    <Pressable onPress={() => setPressed(true)}>
                        <Search theme={theme} />
                    </Pressable>
                    <SettingOption setResetModalVisible={setResetModalVisible} />
                </View>
            </AppBarForm>
            <MessageModal message={"데이터를 초기화하시겠습니까?"} visible={resetModalVisible} onDismiss={() => setResetModalVisible(false)} onConfirm={() => setResetModalVisible(false)} confirmText={"초기화"} />
        </>
    )
}

const styles = StyleSheet.create({
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    },
    left: {
        flex: 1
    },
    container: {
        width: "100%",
        height: Platform.OS === "ios" ? 44 : 56,
        paddingVertical: Platform.OS === "ios" ? 8 : 12,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1
    }
})
