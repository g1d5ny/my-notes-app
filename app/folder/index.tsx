// app/folder/index.tsx
import { File, Folder } from "@/assets/icons/svg/icon"
import { MainAppBar } from "@/component/appBar/MainAppBar"
import { EmptyMemo } from "@/component/EmptyMemo"
import { AddMemoController } from "@/component/modal/add"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { queryClient } from "@/store"
import { DATABASE_NAME, Memo } from "@/type"
import { useFocusEffect } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { RelativePathString, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useContext } from "react"
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

export default function FolderIndex() {
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    // const [memos, setMemos] = useState<Memo[]>([])
    const { data: memos = [] } = useQuery({
        queryKey: [DATABASE_NAME],
        queryFn: async () => {
            const result = await db.getAllAsync(`SELECT * FROM ${DATABASE_NAME}`)
            return result as Memo[]
        }
    })

    const loadMemos = useCallback(async () => {
        queryClient.invalidateQueries({ queryKey: [DATABASE_NAME] })
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

    const MemoList = useCallback(() => {
        if (memos.length === 0) {
            return <EmptyMemo />
        }

        return (
            <>
                <MainAppBar />
                <ScrollView contentContainerStyle={styles.container}>
                    {memos.map(({ title, type, path }, index) => {
                        return (
                            <Pressable key={index} style={styles.item} onPress={() => open(path)}>
                                {type === "file" ? <File /> : <Folder />}
                                <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                                    {title}
                                </Text>
                            </Pressable>
                        )
                    })}
                    {Array.from({ length: Number(Math.max(0, getItemsPerRow() - (memos.length % getItemsPerRow()))) }).map((_, index) => {
                        return <View key={index} style={styles.item} />
                    })}
                </ScrollView>
            </>
        )
    }, [memos, theme])

    useFocusEffect(
        useCallback(() => {
            loadMemos()
        }, [loadMemos])
    )

    return (
        <>
            <MemoList />
            <AddMemoController loadMemos={loadMemos} />
        </>
    )
}

const styles = StyleSheet.create({
    title: {
        ...FontStyles.BodySmall,
        textAlign: "center"
    },
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        padding: 16,
        rowGap: 16
    },
    item: {
        width: 76,
        alignItems: "center"
    }
})
