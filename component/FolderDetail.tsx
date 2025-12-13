// app/folder/FolderDetail.tsx
import { FolderList } from "@/component/FolderList"
import { useGetMemo } from "@/hook/useGetMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { EmptyMemo } from "./EmptyMemo"

export const FolderDetail = () => {
    const { data: memos = [] } = useGetMemo() as UseQueryResult<Memo[], Error>
    console.log("memos: ", memos)

    return memos.length === 0 ? <EmptyMemo /> : <FolderList />
}
