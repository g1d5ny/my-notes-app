import { MemoType } from "@/type"
import { useMutation } from "@tanstack/react-query"
import { useSQLiteContext } from "expo-sqlite"

export const useDeleteMemo = () => {
    const db = useSQLiteContext()

    const { mutate: resetMemo } = useMutation({
        mutationFn: async () => {
            // TODO: db 아예 초기화하는 방법으로 교체
            await db.runAsync(`DELETE FROM ${MemoType.FOLDER}`)
            await db.runAsync(`DELETE FROM ${MemoType.FILE}`)
            await db.execAsync(`DROP TABLE IF EXISTS ${MemoType.FOLDER}`)
            await db.execAsync(`DROP TABLE IF EXISTS ${MemoType.FILE}`)
            await db.execAsync(`PRAGMA user_version = 0`)
        }
    })

    return { resetMemo }
}
