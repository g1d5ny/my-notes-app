import { FontStyles } from "@/constant/Style"
import { StyleSheet, Text, View } from "react-native"

export const EmptyMemo = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={[FontStyles.Display, styles.text]}>메모 없음</Text>
                <Text style={[FontStyles.SubTitle, styles.text]}>새로운 메모를 작성해보세요!</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "#B7B6B6"
    },
    textContainer: {
        gap: 8,
        alignItems: "center"
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
