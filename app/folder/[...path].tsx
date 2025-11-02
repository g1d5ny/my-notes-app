import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { invalidateQueries } from "@/store"
import { Memo, MemoType } from "@/type"
import { useFocusEffect } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useCallback } from "react"

export default function FolderScreen() {
    const params = useLocalSearchParams()
    const db = useSQLiteContext()
    const currentId = params.id ? Number(params?.id) : null
    const currentType = params.type

    const { data: memo = [], isFetched } = useQuery({
        queryKey: [currentId, currentType],
        queryFn: async () => {
            if (currentType === MemoType.FILE) {
                const fileResult = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE id = ?`, [currentId])
                return fileResult[0] as Memo
            }
            const folderResult: Memo[] = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ?`, [currentId])
            const fileResult: Memo[] = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ?`, [currentId])
            return [...folderResult, ...fileResult] as Memo[]
        }
    })

    useFocusEffect(
        useCallback(() => {
            if (currentId && currentType) {
                invalidateQueries([currentId, currentType])
            }
        }, [currentId, currentType])
    )

    return isFetched ? currentType === MemoType.FILE ? <FileDetail memo={memo as Memo} /> : <FolderDetail memo={memo as Memo[]} parentId={currentId} /> : <></>
}
