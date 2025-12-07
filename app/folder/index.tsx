// app/folder/index.tsx
import { MainAppBar } from "@/component/appBar/MainAppBar"
import { FolderList } from "@/component/FolderList"
import RoutingHeader from "@/component/RoutingHeader"
import { EmptyMemo } from "@/context/EmptyMemo"
import { useGetMemo } from "@/hook/useGetMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { useCallback, useState } from "react"

export default function FolderIndex() {
    const [resetModalVisible, setResetModalVisible] = useState(false)
    const { data: memos = [] } = useGetMemo() as UseQueryResult<Memo[], Error>
    const MemoList = useCallback(() => {
        return (
            <>
                <RoutingHeader />
                <FolderList memos={memos} />
            </>
        )
    }, [memos])

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
        </>
    )
}
