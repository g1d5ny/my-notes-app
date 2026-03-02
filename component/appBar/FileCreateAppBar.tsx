import { AndroidBack, Check, Close, IosBack } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { useBackHandler } from "@/hook/useBackHandler"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { AppBarParent } from "./AppBarParent"

type FormValues = {
    title: string
    content: string
}

interface FileCreateAppBarProps {
    textLength: number
    submitFile: () => void
    close: () => void
    back: () => void
}
export const FileCreateAppBar = ({ textLength, submitFile, close, back }: FileCreateAppBarProps) => {
    const theme = useAtomValue(themeAtom)

    useBackHandler(() => {
        if (textLength > 0) {
            close()
            return true
        }
        back()
        return true
    })

    return (
        <AppBarParent>
            <View style={[Styles.row, styles.container]}>
                <View style={[Styles.row, styles.back]}>
                    {textLength > 0 ? (
                        <Pressable hitSlop={10} onPress={close}>
                            <Close theme={theme} />
                        </Pressable>
                    ) : (
                        <Pressable hitSlop={10} onPress={back}>
                            {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
                        </Pressable>
                    )}
                    <Text style={[FontStyles.SubTitle, { color: theme.text }]}>{textLength}</Text>
                </View>
                <Pressable hitSlop={10} onPress={submitFile}>
                    <Check />
                </Pressable>
            </View>
        </AppBarParent>
    )
}

const styles = StyleSheet.create({
    back: {
        gap: Platform.OS === "ios" ? 16 : 8
    },
    container: {
        width: "100%",
        justifyContent: "space-between"
    }
})
