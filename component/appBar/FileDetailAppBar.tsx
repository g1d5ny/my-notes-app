import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { themeAtom } from "@/store"
import { router } from "expo-router"
import { useAtomValue } from "jotai"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import { Styles } from "../../constant/Style"
import { FileEditOption } from "../option/FileEditOption"

export const FileDetailAppBar = () => {
    const theme = useAtomValue(themeAtom)

    const back = () => {
        router.back()
    }

    return (
        <View style={[Styles.row, styles.container]}>
            <Pressable onPress={back}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
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
