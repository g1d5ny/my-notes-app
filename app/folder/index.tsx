// app/folder/index.tsx
import { File, Folder } from "@/assets/icons/svg/icon"
import { MainAppBar } from "@/component/appBar/MainAppBar"
import { EmptyMemo } from "@/component/EmptyMemo"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { Memo } from "@/type"
import { useFocusEffect } from "@react-navigation/native"
import { RelativePathString, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useContext, useState } from "react"
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native"

export default function FolderIndex() {
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    const [memos, setMemos] = useState<Memo[]>([])

    const loadMemos = useCallback(async () => {
        const result = await db.getAllAsync("SELECT * FROM memo")
        setMemos(result as Memo[])
    }, [])

    const getItemsPerRow = () => {
        const screenWidth = Dimensions.get("window").width
        const padding = 32 // 좌우 패딩 16 * 2
        const availableWidth = screenWidth - padding
        const itemWidth = 76 + 16 // 아이템 너비 + gap
        return Math.floor(availableWidth / itemWidth)
    }

    const open = (path: RelativePathString) => {
        router.push(path)
    }

    useFocusEffect(
        useCallback(() => {
            loadMemos()
        }, [loadMemos])
    )

    if (memos.length === 0) {
        return <EmptyMemo />
    }

    return (
        <>
            <MainAppBar />
            <View style={styles.container}>
                {memos.map(({ id, title, type, path }, index) => {
                    return (
                        <Pressable key={index} style={styles.item} onPress={() => open(path)}>
                            {type === "file" ? <File /> : <Folder />}
                            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                                {title}
                            </Text>
                        </Pressable>
                    )
                })}
                {Array.from({ length: Number(Math.max(0, getItemsPerRow() - memos.length / getItemsPerRow())) }).map((_, index) => {
                    return <View key={index} style={styles.item} />
                })}
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        ...FontStyles.BodySmall,
        textAlign: "center"
    },
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: 16,
        gap: 16
    },
    item: {
        width: 76,
        alignItems: "center"
    }
})
