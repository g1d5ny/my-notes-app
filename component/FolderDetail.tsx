// app/folder/FolderDetail.tsx
import { FolderList } from "@/component/FolderList"
import { useReadMemo } from "@/hook/useReadMemo"
import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import { EmptyMemo } from "./EmptyMemo"

export const FolderDetail = () => {
    // 폴더 화면은 자기 라우트 기준(local)으로 읽어, 위에 파일이 열려도 단일 객체가 흘러들지 않게 한다.
    const { data } = useReadMemo(true) as UseQueryResult<Memo[], Error>
    const memos = Array.isArray(data) ? data : []

    return memos.length === 0 ? <EmptyMemo /> : <FolderList memos={memos} />
}
