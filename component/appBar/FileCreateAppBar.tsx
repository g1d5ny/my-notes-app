import { AndroidBack, Check, Close, IosBack } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { useBackHandler } from "@/hook/useBackHandler"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { themeAtom } from "@/store"
import { useGlobalSearchParams } from "expo-router"
import { useAtomValue } from "jotai"
import { UseFormHandleSubmit } from "react-hook-form"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import Toast from "react-native-toast-message"
import { AppBarParent } from "./AppBarParent"

type FormValues = {
    title: string
    content: string
}

interface FileCreateAppBarProps {
    textLength: number
    handleSubmit: UseFormHandleSubmit<FormValues, FormValues>
    close: () => void
    back: () => void
}
export const FileCreateAppBar = ({ textLength, handleSubmit, close, back }: FileCreateAppBarProps) => {
    const theme = useAtomValue(themeAtom)
    const params = useGlobalSearchParams()
    const { createFile } = useCreateMemo()

    const submitFile = () => {
        handleSubmit(
            async data => {
                createFile({ title: data.title, content: data.content, parentId: params.id ? Number(params.id) : null })
                back()
            },
            errors => {
                const titleError = errors.title
                const errorText = titleError ? "제목을 입력해주세요." : "내용을 입력해주세요."
                console.error("메모 저장 실패:", errors)
                Toast.show({
                    text1: errorText,
                    type: "customToast",
                    position: "bottom",
                    visibilityTime: 1000
                })
            }
        )()
    }

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
