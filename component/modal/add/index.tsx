import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import type { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { useRef } from "react"
import { AddFile } from "./file"
import { AddMemo } from "./memo"

export const AddMemoController = () => {
    const bottomSheetRef = useRef<BottomSheetModalMethods>(null)

    const handleAddFile = () => {
        bottomSheetRef.current?.present()
    }

    return (
        <BottomSheetModalProvider>
            <AddMemo onAddFile={handleAddFile} />
            <AddFile ref={bottomSheetRef} />
        </BottomSheetModalProvider>
    )
}
