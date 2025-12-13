import { AndroidBack, Check, Close, IosBack } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { useLocalSearchParams } from "expo-router"
import { useContext } from "react"
import { UseFormHandleSubmit } from "react-hook-form"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import Toast from "react-native-toast-message"
import { AppBarForm } from "./AppBarForm"

type FormValues = {
    title: string
    content: string
}

interface FileCreateAppBarProps {
    textLength: number
    handleSubmit: UseFormHandleSubmit<FormValues, FormValues>
    close: () => void
    back: () => void
    inputBlur: () => void
}
export const FileCreateAppBar = ({ textLength, handleSubmit, close, back, inputBlur }: FileCreateAppBarProps) => {
    const { theme } = useContext(ThemeContext)
    const params = useLocalSearchParams()
    const { createFile } = useCreateMemo()
    const parentId = params.parentId ? Number(params.parentId) : null

    const submitFile = () => {
        handleSubmit(
            async data => {
                createFile({ title: data.title, content: data.content, parentId })
                inputBlur()
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

    return (
        <AppBarForm>
            <View style={[Styles.row, styles.container]}>
                <View style={[Styles.row, styles.back]}>
                    {textLength > 0 ? (
                        <Pressable onPress={close}>
                            <Close theme={theme} />
                        </Pressable>
                    ) : (
                        <Pressable onPress={back}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
                    )}
                    <Text style={[FontStyles.SubTitle, { color: theme.text }]}>{textLength}</Text>
                </View>
                <Pressable onPress={submitFile}>
                    <Check />
                </Pressable>
            </View>
        </AppBarForm>
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
