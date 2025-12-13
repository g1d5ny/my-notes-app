// app/folder/FolderDetail.tsx
import { FolderList } from "@/component/FolderList"
import { useGetMemo } from "@/hook/useGetMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { EmptyMemo } from "./EmptyMemo"

export const FolderDetail = () => {
    const { data: memo = [] } = useGetMemo() as UseQueryResult<Memo[], Error>

    return (
        <>
            {/* <MainAppBar setResetModalVisible={setResetModalVisible} /> */}
            {/* <RoutingHeader /> */}
            {memo.length === 0 ? <EmptyMemo /> : <FolderList />}
        </>
    )
}
