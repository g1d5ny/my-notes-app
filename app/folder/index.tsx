// app/folder/index.tsx
import { EmptyMemo } from "@/component/EmptyMemo"
import { FolderList } from "@/component/FolderList"
import { useGetMemo } from "@/hook/useGetMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"

export default function FolderIndex() {
    const { data: memos = [] } = useGetMemo() as UseQueryResult<Memo[], Error>

    return memos.length === 0 ? <EmptyMemo /> : <FolderList />
}
