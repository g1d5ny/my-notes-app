import { Memo, MemoType } from "@/type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"

export const useGetMemo = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const queryClient = useQueryClient()
    const currentId = params.id ? Number(params?.id) : 0
    const currentType = (params.type as MemoType) ?? MemoType.FOLDER

    // TODO: 메모, 파일간 이동할 때는 getQueryData로 cache값 가져오게 처리
    return useQuery({
        // queryKey 구조 통일: 폴더 목록은 ['folder', id], 파일 상세는 ['file', id]
        queryKey: [currentType, currentId],
        queryFn: async () => {
            // root인 경우
            if (currentId === 0) {
                const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId IS NULL`)
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId IS NULL`)
                const result = [...folderResult, ...fileResult] as Memo[]
                await queryClient.setQueryData([currentType, currentId], result)
                return result
            }
            // 파일 타입인 경우
            if (currentType === MemoType.FILE) {
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE id = ?`, [currentId])
                const result = fileResult[0] as Memo
                await queryClient.setQueryData([currentType, currentId], result)
                return result
            }
            // 폴더 타입인 경우
            const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ?`, [currentId])
            const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ?`, [currentId])
            const result = [...folderResult, ...fileResult] as Memo[]
            await queryClient.setQueryData([currentType, currentId], result)
            return result
        },
        enabled: currentId >= 0
    })
}
