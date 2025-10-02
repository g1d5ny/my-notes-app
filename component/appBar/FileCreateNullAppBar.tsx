import { AndroidBack, IosBack } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useRouter } from "expo-router"
import { useContext } from "react"
import { Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { AppBarForm } from "./AppBarForm"

interface FileCreateNullAppBarProps {
    textLength: number
}
export const FileCreateNullAppBar = ({ textLength }: FileCreateNullAppBarProps) => {
    const { theme } = useContext(ThemeContext)
    const router = useRouter()

    return (
        <AppBarForm>
            <View style={[Styles.row, styles.back]}>
                <Pressable onPress={() => router.back()}>{Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}</Pressable>
                <Text style={[FontStyles.SubTitle, { color: theme.text }]}>{textLength}</Text>
            </View>
        </AppBarForm>
    )
}

const styles = StyleSheet.create({
    back: {
        gap: Platform.OS === "ios" ? 16 : 8
    }
})
