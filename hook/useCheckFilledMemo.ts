import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"

export const useCheckFilledMemo = (memos: Memo[]) => {
    const db = useSQLiteContext()
    const folderIds = (Array.isArray(memos) ? memos : []).filter(m => m.type === MemoType.FOLDER).map(m => m.id)

    return useQuery({
        queryKey: ["checkFilledMemo", folderIds],
        queryFn: async () => {
            // 폴더마다 COUNT N번 대신, 자식이 있는 parentId를 한 방에 조회
            const placeholders = folderIds.map(() => "?").join(", ")
            const rows = await db.getAllAsync<{ parentId: number }>(
                `SELECT parentId FROM (
                    SELECT parentId FROM ${MemoType.FOLDER} WHERE parentId IN (${placeholders})
                    UNION ALL
                    SELECT parentId FROM ${MemoType.FILE} WHERE parentId IN (${placeholders})
                 ) GROUP BY parentId`,
                [...folderIds, ...folderIds]
            )
            const filledSet = new Set(rows.map(r => r.parentId))
            const map: Record<number, boolean> = {}
            folderIds.forEach(id => {
                map[id] = filledSet.has(id)
            })
            return map
        },
        enabled: folderIds.length > 0
    })
}
