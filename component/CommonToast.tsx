import { Elevation, FontStyles, Radius, Spacing } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Toast, { BaseToastProps } from "react-native-toast-message"

export const CommonToast = () => {
    const theme = useAtomValue(themeAtom)
    const insets = useSafeAreaInsets()

    const toastConfig = {
        customToast: ({ text1 }: BaseToastProps) => (
            <View style={[styles.toast, Elevation.high, { backgroundColor: theme.accent }]}>
                <Text style={[FontStyles.BodySmall, { color: theme.onAccent }]} numberOfLines={2}>
                    {text1}
                </Text>
            </View>
        )
    }

    // edge-to-edge라 화면 맨 아래가 내비게이션 바 밑이므로, 하단 인셋만큼 띄워 겹치지 않게.
    return <Toast config={toastConfig} bottomOffset={insets.bottom + Spacing.lg} />
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
