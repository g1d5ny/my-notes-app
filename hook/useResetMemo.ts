import { MemoType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"

export const useResetMemo = () => {
    const db = useSQLiteContext()
    const queryClient = useQueryClient()
    const params = useLocalSearchParams()
    const currentType = (params.type as MemoType) ?? MemoType.FOLDER
    const currentId = params.id ? Number(params?.id) : 0

    return useMutation({
        mutationFn: async () => {
            // TODO: db 아예 초기화하는 방법으로 교체
            await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
            await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
            await queryClient.invalidateQueries({ queryKey: [currentType, currentId] })
        }
    })
}
