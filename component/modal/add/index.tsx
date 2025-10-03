import BottomSheet from "@gorhom/bottom-sheet"
import { useRef } from "react"
import AddFile from "./file"
import { AddMemo } from "./memo"

export const AddMemoController = () => {
    const bottomSheetRef = useRef<BottomSheet>(null)

    const handleAddFile = () => {
        bottomSheetRef.current?.expand()
    }

    const handleAddFolder = () => {
        // 폴더 추가 로직
    }

    return (
        <>
            <AddMemo onAddFile={handleAddFile} onAddFolder={handleAddFolder} />
            <AddFile ref={bottomSheetRef} />
        </>
    )
}
