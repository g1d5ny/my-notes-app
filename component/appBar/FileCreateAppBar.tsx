import { AndroidBack, Check, Close, IosBack } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { invalidateQueries } from "@/store"
import { MemoType } from "@/type"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
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
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const parentId = params.id ? Number(params.id) : null

    const submitFile = () => {
        handleSubmit(
            async data => {
                try {
                    const now = Math.floor(Date.now() / 1000)
                    await db.runAsync(
                        `INSERT INTO ${MemoType.FILE} (type, title, content, parentId, createdAt, updatedAt, viewedAt)
                        VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [MemoType.FILE, data.title, data.content, parentId, now, now, now]
                    )

                    inputBlur()
                    back()

                    if (parentId) {
                        await invalidateQueries([parentId])
                    } else {
                        await invalidateQueries([MemoType.FOLDER, MemoType.FILE])
                    }

                    Toast.show({
                        text1: "작성된 글이 저장되었습니다.",
                        type: "customToast",
                        position: "bottom",
                        visibilityTime: 3000
                    })
                } catch (error) {
                    console.error("메모 저장 실패:", error)
                    Toast.show({
                        text1: "메모 저장에 실패했습니다.",
                        type: "customToast",
                        position: "bottom",
                        visibilityTime: 3000
                    })
                }
            },
            errors => {
                const titleError = errors.title
                const errorText = titleError ? "제목을 입력해주세요." : "내용을 입력해주세요."
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
