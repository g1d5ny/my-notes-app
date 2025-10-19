import { queryClient } from "@/store"
import { MemoType } from "@/type"
import BottomSheet from "@gorhom/bottom-sheet"
import { RelativePathString, usePathname } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useRef } from "react"
import { AddFile } from "./file"
import { AddMemo } from "./memo"

interface AddMemoControllerProps {
    loadMemos: () => Promise<void>
}
export const AddMemoController = ({ loadMemos }: AddMemoControllerProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const db = useSQLiteContext()
    const pathname = usePathname()
    const parentId = pathname.split("/").pop() ?? ""

    const handleAddFile = () => {
        bottomSheetRef.current?.expand()
    }

    const handleAddFolder = async () => {
        // 폴더 추가 로직
        try {
            const result = await db.runAsync(
                `INSERT INTO ${MemoType.FOLDER} (type, title, parentId, path)
                VALUES (?, ?, ?, ?)`,
                [MemoType.FOLDER, "새 폴더", parentId, `/`]
            )
            const newId = result.lastInsertRowId
            const newPath = `${pathname}/${newId}` as RelativePathString

            await db.runAsync(`UPDATE ${MemoType.FOLDER} SET path = ? WHERE id = ?`, [newPath, newId])
            queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER] })
        } catch (error) {
            console.error("폴더 추가 실패:", error)
        }
    }

    return (
        <>
            <AddMemo onAddFile={handleAddFile} onAddFolder={handleAddFolder} />
            <AddFile ref={bottomSheetRef} loadMemos={loadMemos} />
        </>
    )
}
