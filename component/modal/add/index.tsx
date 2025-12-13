import BottomSheet from "@gorhom/bottom-sheet"
import { useRef } from "react"
import { AddFile } from "./file"
import { AddMemo } from "./memo"

export const AddMemoController = () => {
    const bottomSheetRef = useRef<BottomSheet>(null)

    const handleAddFile = () => {
        bottomSheetRef.current?.expand()
    }

    return (
        <>
            <AddMemo onAddFile={handleAddFile} />
            <AddFile ref={bottomSheetRef} />
        </>
    )
}
