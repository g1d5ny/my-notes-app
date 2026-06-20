import { Elevation, FontStyles, Radius, Spacing } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"
import Toast, { BaseToastProps } from "react-native-toast-message"

export const CommonToast = () => {
    const theme = useAtomValue(themeAtom)

    const toastConfig = {
        customToast: ({ text1 }: BaseToastProps) => (
            <View style={[styles.toast, Elevation.high, { backgroundColor: theme.accent }]}>
                <Text style={[FontStyles.BodySmall, { color: theme.onAccent }]} numberOfLines={2}>
                    {text1}
                </Text>
            </View>
        )
    }

    return <Toast config={toastConfig} />
}

const styles = StyleSheet.create({
    toast: {
        alignSelf: "center",
        maxWidth: "88%",
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: Radius.full
    }
})
