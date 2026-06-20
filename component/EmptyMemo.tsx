import { FontStyles, Spacing } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { StyleSheet, Text, View } from "react-native"

export const EmptyMemo = () => {
    const theme = useAtomValue(themeAtom)

    return (
        <View style={styles.container}>
            <Text style={[FontStyles.Title, styles.title, { color: theme.text }]}>메모 없음</Text>
            <Text style={[FontStyles.Body, styles.subtitle, { color: theme.textSecondary }]}>새로운 메모를 작성해보세요!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: Spacing.sm
    },
    title: {
        textAlign: "center"
    },
    subtitle: {
        textAlign: "center"
    }
})
