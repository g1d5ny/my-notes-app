import { MemoType } from "@/type"
import BottomSheet from "@gorhom/bottom-sheet"
import { useQueryClient } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useRef } from "react"
import { AddFile } from "./file"
import { AddMemo } from "./memo"

export const AddMemoController = () => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const db = useSQLiteContext()
    const params = useLocalSearchParams()
    const queryClient = useQueryClient()
    const parentId = params.id ? Number(params.id) : null

    const handleAddFile = () => {
        bottomSheetRef.current?.expand()
    }

    const handleAddFolder = async () => {
        // 폴더 추가 로직
        try {
            await db.runAsync(
                `INSERT INTO ${MemoType.FOLDER} (type, title, parentId)
                VALUES (?, ?, ?)`,
                [MemoType.FOLDER, "새 폴더", parentId]
            )

            // queryKey 구조에 맞게 수정
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, parentId] })
        } catch (error) {
            console.error("폴더 추가 실패:", error)
        }
    }

    return (
        <>
            <AddMemo onAddFile={handleAddFile} onAddFolder={handleAddFolder} />
            <AddFile ref={bottomSheetRef} />
        </>
    )
}
