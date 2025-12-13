import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"
import { useMemo } from "react"

export const useCheckFilledMemo = (memos: Memo[]) => {
    const db = useSQLiteContext()

    const folderIds = useMemo(() => memos?.filter(m => m.type === MemoType.FOLDER).map(m => m.id), [])

    // 각 폴더 아이템마다 내용이 있는지 체크
    const checkFolderHasMemo = async (folderId: number) => {
        const result = await db.getFirstAsync<{ totalCount: number }>(
            `SELECT 
                (SELECT COUNT(*) FROM folder WHERE parentId = ?) + 
                (SELECT COUNT(*) FROM file WHERE parentId = ?) as totalCount`,
            [folderId, folderId]
        )
        return (result?.totalCount ?? 0) > 0
    }

    return useQuery({
        queryKey: [folderIds],
        queryFn: async () => {
            const map: Record<number, boolean> = {}
            await Promise.all(
                folderIds.map(async id => {
                    map[id] = await checkFolderHasMemo(id)
                })
            )
            return map
        },
        enabled: folderIds?.length > 0
    })
}
