import { sortAtom } from "@/store"
import { Memo, MemoType, SortType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useAtomValue } from "jotai"

const ORDER_BY = {
    [SortType.CREATED_AT]: `ORDER BY ${SortType.CREATED_AT} DESC`,
    [SortType.UPDATED_AT]: `ORDER BY ${SortType.UPDATED_AT} DESC`,
    [SortType.TITLE]: `ORDER BY ${SortType.TITLE} ASC`
}

const sort = (memos: Memo[], sortType: SortType) => {
    switch (sortType) {
        case SortType.CREATED_AT:
            return memos.sort((a, b) => b.createdAt - a.createdAt)
        case SortType.UPDATED_AT:
            return memos.sort((a, b) => b.updatedAt - a.updatedAt)
        case SortType.TITLE:
            return memos.sort((a, b) => a.title.localeCompare(b.title))
    }
    return memos
}

/**
 * @param useLocal 화면 자신의 라우트 파라미터로 읽을지 여부.
 *   - false(기본): 포커스된 라우트 기준(global). 루트 앱바의 공유/설정처럼 화면 트리 밖에서 호출하는 경우.
 *   - true: 자신의 라우트 기준(local). 폴더 화면이 그 위에 파일이 push돼도 자기 폴더 내용을 유지하도록.
 */
export const useReadMemo = (useLocal = false) => {
    const db = useSQLiteContext()
    const globalParams = useGlobalSearchParams()
    const localParams = useLocalSearchParams()
    const params = useLocal ? localParams : globalParams
    const sortType = useAtomValue(sortAtom)
    const currentId = params.id ? Number(params?.id) : 0
    const currentType = (params.type as MemoType) ?? MemoType.FOLDER

    return useQuery({
        // queryKey 구조 통일: 폴더 목록은 ['folder', id], 파일 상세는 ['file', id]
        // sortType을 queryKey에 포함하여 정렬 변경 시 자동으로 재조회되도록 함
        queryKey: [currentType, currentId, sortType],
        queryFn: async () => {
            // root인 경우
            if (currentId === 0) {
                const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId IS NULL ${ORDER_BY[sortType]}`)
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId IS NULL ${ORDER_BY[sortType]}`)
                const allResult = [...folderResult, ...fileResult] as Memo[]
                return sort(allResult, sortType) as Memo[]
            }
            // 파일 타입인 경우
            if (currentType === MemoType.FILE) {
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE id = ?`, [currentId])
                // 삭제된 파일을 조회하면 빈 배열 → undefined 대신 null 반환(React Query v5는 undefined 금지).
                return (fileResult[0] as Memo) ?? null
            }
            // 폴더 타입인 경우
            const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ? ${ORDER_BY[sortType]}`, [currentId])
            const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ? ${ORDER_BY[sortType]}`, [currentId])
            const allResult = [...folderResult, ...fileResult] as Memo[]
            return sort(allResult, sortType) as Memo[]
        },
        enabled: currentId >= 0
    })
}
