import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { appBarAtom, themeAtom } from "@/store"
import { AppBar } from "@/type"
import { router, useGlobalSearchParams } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { FontStyles, Styles } from "../../constant/Style"
import { FileEditOption } from "../option/FileEditOption"

export const FileDetailAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const setAppbar = useSetAtom(appBarAtom)
    const params = useGlobalSearchParams()

    const back = () => {
        router.back()
        setAppbar(AppBar.MAIN)
    }

    return (
        <View style={[Styles.row, styles.container]}>
            <Pressable hitSlop={10} onPress={back}>
                {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
            </Pressable>
            <Text style={[styles.length, { color: theme.text }]} numberOfLines={1} ellipsizeMode='tail'>
                {params.content?.length}
            </Text>
            <FileEditOption />
        </View>
    )
}

const styles = StyleSheet.create({
    length: {
        ...FontStyles.SubTitle,
        flex: 1,
        marginHorizontal: 8
    },
    container: {
        width: "100%",
        justifyContent: "space-between"
    }
})
