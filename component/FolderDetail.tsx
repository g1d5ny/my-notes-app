// app/folder/FolderDetail.tsx
import { FolderList } from "@/component/FolderList"
import { useReadMemo } from "@/hook/useReadMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { EmptyMemo } from "./EmptyMemo"

export const FolderDetail = () => {
    const { data: memos = [] } = useReadMemo() as UseQueryResult<Memo[], Error>

    return memos.length === 0 ? <EmptyMemo /> : <FolderList />
}
