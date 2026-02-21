import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { appBarAtom, themeAtom } from "@/store"
import { AppBar } from "@/type"
import { router } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { Styles } from "../../constant/Style"
import { FileEditOption } from "../option/FileEditOption"

export const FileDetailAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const setAppbar = useSetAtom(appBarAtom)

    const back = () => {
        router.back()
        setAppbar(AppBar.MAIN)
    }

    return (
        <View style={[Styles.row, styles.container]}>
            <Pressable hitSlop={10} onPress={back}>
                {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
            </Pressable>
            <FileEditOption />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        justifyContent: "space-between"
    }
})
