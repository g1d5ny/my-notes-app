// app/folder/FolderDetail.tsx
import { FolderList } from "@/component/FolderList"
import { useGetMemo } from "@/hook/useGetMemo"
import { useResetMemo } from "@/hook/useResetMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { useState } from "react"
import { EmptyMemo } from "../context/EmptyMemo"
import RoutingHeader from "./RoutingHeader"
import { MainAppBar } from "./appBar/MainAppBar"
import { MessageModal } from "./modal/MessageModal"

export const FolderDetail = () => {
    const { data: memo = [] } = useGetMemo() as UseQueryResult<Memo[], Error>
    const [resetModalVisible, setResetModalVisible] = useState(false)
    const { mutate: resetMemo } = useResetMemo()

    return (
        <>
            <MainAppBar setResetModalVisible={setResetModalVisible} />
            <RoutingHeader />
            {memo.length === 0 ? <EmptyMemo /> : <FolderList memos={memo} />}
            <MessageModal
                message={"데이터를 초기화하시겠습니까?"}
                visible={resetModalVisible}
                onDismiss={() => setResetModalVisible(false)}
                onConfirm={async () => {
                    resetMemo()
                    setResetModalVisible(false)
                }}
                confirmText={"초기화"}
            />
        </>
    )
}
