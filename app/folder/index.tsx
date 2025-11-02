// app/folder/index.tsx
import { MainAppBar } from "@/component/appBar/MainAppBar"
import { EmptyMemo } from "@/component/EmptyMemo"
import { FolderList } from "@/component/FolderList"
import { AddMemoController } from "@/component/modal/add"
import RoutingHeader from "@/component/RoutingHeader"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { invalidateQueries } from "@/store"
import { Memo, MemoType } from "@/type"
import { useFocusEffect } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useContext, useState } from "react"
import { StyleSheet } from "react-native"

export default function FolderIndex() {
    const { theme } = useContext(ThemeContext)
    const db = useSQLiteContext()
    const [resetModalVisible, setResetModalVisible] = useState(false)

    const { data: memos = [] } = useQuery({
        queryKey: [MemoType.FOLDER, MemoType.FILE],
        queryFn: async () => {
            const folders = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId IS NULL`)
            const files = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId IS NULL`)
            return [...folders, ...files] as Memo[]
        }
    })

    const loadMemos = useCallback(async () => {
        await invalidateQueries([MemoType.FOLDER, MemoType.FILE])
    }, [])

    const MemoList = useCallback(() => {
        return (
            <>
                <RoutingHeader />
                <FolderList memos={memos} />
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
            {memos.length === 0 ? (
                <EmptyMemo />
            ) : (
                <>
                    <MainAppBar setResetModalVisible={setResetModalVisible} />
                    <MemoList />
                </>
            )}
            <AddMemoController />
            {/* <MessageModal
                message={"데이터를 초기화하시겠습니까?"}
                visible={resetModalVisible}
                onDismiss={() => setResetModalVisible(false)}
                onConfirm={async () => {
                    // TODO db 아예 초기화하는 방법으로 교체
                    await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
                    await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
                    await loadMemos()
                    router.replace("/folder")
                    setResetModalVisible(false)
                }}
                confirmText={"초기화"}
            /> */}
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
