import { Check, Close } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useRouter } from "expo-router"
import { useContext, useState } from "react"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import Toast from "react-native-toast-message"
import { MessageModal } from "../modal/MessageModal"
import { AppBarForm } from "./AppBarForm"

interface FileSubmitAppBarProps {
    textLength: number
}
export const FileSubmitAppBar = ({ textLength }: FileSubmitAppBarProps) => {
    const { theme } = useContext(ThemeContext)
    const router = useRouter()
    const [submitModalVisible, setSubmitModalVisible] = useState(false)

    const submitFile = () => {
        // TODO: 작성된 글 저장 로직 추가
        router.back()
        Toast.show({
            text1: "작성된 글이 저장되었습니다.",
            type: "customToast",
            position: "bottom",
            visibilityTime: 5000
        })
    }

    return (
        <>
            <AppBarForm>
                <View style={[Styles.row, styles.container]}>
                    <View style={[Styles.row, styles.back]}>
                        <Pressable onPress={() => setSubmitModalVisible(true)}>
                            <Close theme={theme} />
                        </Pressable>
                        <Text style={[FontStyles.SubTitle, { color: theme.text }]}>{textLength}</Text>
                    </View>
                    <Pressable onPress={submitFile}>
                        <Check theme={theme} />
                    </Pressable>
                </View>
            </AppBarForm>
            <MessageModal
                message={"뒤로 가시면 작성된 글이 삭제됩니다.\n뒤로 가시겠습니까?"}
                visible={submitModalVisible}
                onDismiss={() => setSubmitModalVisible(false)}
                onConfirm={() => {
                    setSubmitModalVisible(false)
                    router.back()
                }}
                confirmText={"뒤로 가기"}
            />
        </>
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
