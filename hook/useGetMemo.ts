import { sortAtom } from "@/store"
import { Memo, MemoType, SortType } from "@/type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useAtomValue } from "jotai"

const ORDER_BY = {
    [SortType.CREATED_AT]: `ORDER BY ${SortType.CREATED_AT} DESC`,
    [SortType.UPDATED_AT]: `ORDER BY ${SortType.UPDATED_AT} DESC`,
    [SortType.TITLE]: `ORDER BY ${SortType.TITLE} ASC`
}

export const useGetMemo = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const queryClient = useQueryClient()
    const sortType = useAtomValue(sortAtom)
    const currentId = params.id ? Number(params?.id) : 0
    const currentType = (params.type as MemoType) ?? MemoType.FOLDER

    // TODO: 메모, 파일간 이동할 때는 getQueryData로 cache값 가져오게 처리
    return useQuery({
        // queryKey 구조 통일: 폴더 목록은 ['folder', id], 파일 상세는 ['file', id]
        // sortType을 queryKey에 포함하여 정렬 변경 시 자동으로 재조회되도록 함
        queryKey: [currentType, currentId, sortType],
        queryFn: async () => {
            // root인 경우
            if (currentId === 0) {
                const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId IS NULL ${ORDER_BY[sortType]}`)
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId IS NULL ${ORDER_BY[sortType]}`)
                const result = [...folderResult, ...fileResult] as Memo[]
                await queryClient.setQueryData([currentType, currentId, sortType], result)
                return result
            }
            // 파일 타입인 경우
            if (currentType === MemoType.FILE) {
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE id = ?`, [currentId])
                const result = fileResult[0] as Memo
                await queryClient.setQueryData([currentType, currentId, sortType], result)
                return result
            }
            // 폴더 타입인 경우
            const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ? ${ORDER_BY[sortType]}`, [currentId])
            const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ? ${ORDER_BY[sortType]}`, [currentId])
            const result = [...folderResult, ...fileResult] as Memo[]
            await queryClient.setQueryData([currentType, currentId, sortType], result)
            return result
        },
        enabled: currentId >= 0
    })
}
