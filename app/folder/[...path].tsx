import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { StyleSheet } from "react-native"

export default function FolderScreen() {
    const params = useLocalSearchParams()
    const parentId = Number(params.id)
    const db = useSQLiteContext()

    const { data: memo = [], isFetched } = useQuery({
        queryKey: [parentId],
        queryFn: async () => {
            const folderResult: Memo[] = await db.getAllAsync(`SELECT * FROM ${MemoType.FOLDER} WHERE parentId = ?`, [parentId])
            const fileResult: Memo[] = await db.getAllAsync(`SELECT * FROM ${MemoType.FILE} WHERE parentId = ?`, [parentId])
            return [...folderResult, ...fileResult]
        }
    })

    const fileMemo = memo.find(item => item.type === MemoType.FILE) as Memo

    return isFetched ? params?.type === MemoType.FILE ? <FileDetail memo={fileMemo} /> : <FolderDetail memo={memo} parentId={parentId} /> : <></>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        gap: 12
    }
})
