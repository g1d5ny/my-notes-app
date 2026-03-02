// hook/useSearchMemo.ts
import { searchInputAtom } from "@/store"
import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"
import { useAtomValue } from "jotai"

export const useSearchedMemo = () => {
    const db = useSQLiteContext()
    const searchInput = useAtomValue(searchInputAtom)
    const keyword = searchInput.value

    return useQuery({
        queryKey: ["searchedMemo", keyword],
        enabled: keyword.length > 0,
        queryFn: async () => {
            const like = `%${keyword}%`

            const folderResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE title LIKE ?`, [like])
            const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE title LIKE ?`, [like])

            return [...folderResult, ...fileResult] as Memo[]
        }
    })
}
