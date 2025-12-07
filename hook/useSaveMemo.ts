import { MemoType } from "@/type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"

export const useSaveMemo = () => {
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const queryClient = useQueryClient()
    const currentId = params.id ? Number(params?.id) : 0
    const currentType = (params.type as MemoType) ?? MemoType.FOLDER

    const saveTitle = (title: string, memoId: number) =>
        useQuery({
            queryKey: [currentType, currentId],
            queryFn: async () => {
                await db.runAsync(`UPDATE ${MemoType.FILE} SET title = ? WHERE id = ?`, [title, memoId])
                // 부모 폴더 목록 invalidate
                await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, currentId] })
                // 파일 상세 invalidate
                await queryClient.invalidateQueries({ queryKey: [MemoType.FILE, memoId] })
            },
            enabled: memoId >= 0
        })

    return { saveTitle }
}
