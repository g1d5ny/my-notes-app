// app/folder/index.tsx
import { File, Folder } from "@/assets/icons/svg/icon"
import { MainAppBar } from "@/component/appBar/MainAppBar"
import { EmptyMemo } from "@/component/EmptyMemo"
import { AddMemoController } from "@/component/modal/add"
import { MessageModal } from "@/component/modal/MessageModal"
import RoutingHeader from "@/component/RoutingHeader"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { queryClient } from "@/store"
import { Memo, MemoType } from "@/type"
import { useFocusEffect } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { RelativePathString, router } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useContext, useState } from "react"
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native"

export default function FolderIndex() {
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    const [resetModalVisible, setResetModalVisible] = useState(false)

    const { data: memos = [] } = useQuery({
        queryKey: [MemoType.FOLDER, MemoType.FILE],
        queryFn: async () => {
            const folders = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER}`)
            const files = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE}`)

            return [...folders, ...files] as Memo[]
        }
    })

    const loadMemos = useCallback(async () => {
        queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, MemoType.FILE] })
    }, [])

    const getItemsPerRow = () => {
        const screenWidth = Dimensions.get("window").width
        const padding = 32 // 좌우 패딩 16 * 2
        const availableWidth = screenWidth - padding
        const itemWidth = 76 + 16 // 아이템 너비 + gap
        return Math.floor(availableWidth / itemWidth)
    }

    const open = (path: RelativePathString) => {
        // console.log("path: ", path)
        router.push(path)
    }

    const MemoList = useCallback(() => {
        return (
            <View style={styles.container}>
                <RoutingHeader />
                <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                    {memos.map(({ title, type, path }, index) => {
                        return (
                            <Pressable key={index} style={styles.item} onPress={() => open(path)}>
                                {type === MemoType.FILE ? <File /> : <Folder />}
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
            </View>
        )
    }, [memos, theme])

    useFocusEffect(
        useCallback(() => {
            loadMemos()
        }, [loadMemos])
    )

    return (
        <>
            {memos.length === 0 ? (
                <EmptyMemo />
            ) : (
                <>
                    <MainAppBar setResetModalVisible={setResetModalVisible} />
                    <MemoList />
                </>
            )}
            <AddMemoController loadMemos={loadMemos} />
            <MessageModal
                message={"데이터를 초기화하시겠습니까?"}
                visible={resetModalVisible}
                onDismiss={() => setResetModalVisible(false)}
                onConfirm={async () => {
                    // TODO db 아예 초기화하는 방법으로 교체
                    await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
                    await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
                    await loadMemos()
                    setResetModalVisible(false)
                }}
                confirmText={"초기화"}
            />
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
        padding: 16,
        gap: 12
    },
    contentContainerStyle: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: 16
    },
    item: {
        width: 76,
        alignItems: "center"
    }
})
