import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"

export const useCheckFilledMemo = (memos: Memo[]) => {
    const db = useSQLiteContext()
    const folderIds = memos?.filter(m => m.type === MemoType.FOLDER).map(m => m.id)

    // 각 폴더 아이템마다 내용이 있는지 체크
    const checkFolderFilled = async (folderId: number) => {
        const result = await db.getFirstAsync<{ totalCount: number }>(
            `SELECT 
            (SELECT COUNT(*) FROM folder WHERE parentId = ?) + 
            (SELECT COUNT(*) FROM file WHERE parentId = ?) as totalCount`,
            [folderId, folderId]
        )
        return (result?.totalCount ?? 0) > 0
    }

    return useQuery({
        queryKey: ["checkFilledMemo", folderIds],
        queryFn: async () => {
            const map: Record<number, boolean> = {}
            await Promise.all(
                folderIds.map(async id => {
                    map[id] = await checkFolderFilled(id)
                })
            )

            return map
        },
        enabled: folderIds?.length > 0
    })
}
