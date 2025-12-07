import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"

export const useGetMemo = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const currentId = params.id ? Number(params?.id) : 0
    const currentType = (params.type as MemoType) ?? MemoType.FOLDER

    // queryKey 구조 통일: 폴더 목록은 ['folder', id], 파일 상세는 ['file', id]
    return useQuery({
        queryKey: [currentType, currentId],
        queryFn: async () => {
            // root인 경우
            if (currentId === 0) {
                const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId IS NULL`)
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId IS NULL`)
                return [...folderResult, ...fileResult] as Memo[]
            }
            if (currentType === MemoType.FILE) {
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE id = ?`, [currentId])
                return fileResult[0] as Memo
            }
            const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ?`, [currentId])
            const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ?`, [currentId])
            return [...folderResult, ...fileResult] as Memo[]
        },
        enabled: currentId >= 0
    })
}
