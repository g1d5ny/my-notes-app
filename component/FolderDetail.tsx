// app/folder/FolderDetail.tsx
import { FolderList } from "@/component/FolderList"
import { queryClient } from "@/store"
import { Memo, MemoType } from "@/type"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback, useState } from "react"
import { EmptyMemo } from "./EmptyMemo"
import RoutingHeader from "./RoutingHeader"
import { MainAppBar } from "./appBar/MainAppBar"
import { MessageModal } from "./modal/MessageModal"
import { AddMemoController } from "./modal/add"

export const FolderDetail = ({ memo, parentId }: { memo: Memo[]; parentId: number }) => {
    const db = useSQLiteContext()
    const [resetModalVisible, setResetModalVisible] = useState(false)

    const loadMemos = useCallback(async () => {
        queryClient.invalidateQueries({ queryKey: [parentId] })
    }, [])

    return (
        <>
            <MainAppBar setResetModalVisible={setResetModalVisible} />
            <RoutingHeader />
            {memo.length === 0 ? <EmptyMemo /> : <FolderList memos={memo} />}
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
