// app/folder/index.tsx
import { EmptyMemo } from "@/component/EmptyMemo"
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite"
import { useEffect, useState } from "react"
import { migrateDbIfNeeded } from "../_layout"

export default function FolderIndex() {
    const [db, setDb] = useState<SQLiteDatabase | null>(null)
    const [memos, setMemos] = useState<unknown[]>([])

    useEffect(() => {
        async function setup() {
            const db = await openDatabaseAsync("memo.db")
            await migrateDbIfNeeded(db)
            const result = await db.getAllAsync("SELECT * FROM memo")
            console.log("메모들:", result)
            setDb(db)
            setMemos(result)
        }
        setup()
    }, [])

    if (memos.length === 0) {
        return <EmptyMemo />
    }

    return <></>
}
