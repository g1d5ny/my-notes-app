import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { MemoType } from "@/type"
import { useLocalSearchParams } from "expo-router"

export default function FolderScreen() {
    const params = useLocalSearchParams()
    const currentType = params.type as MemoType

    return currentType === MemoType.FILE ? <FileDetail /> : <FolderDetail />
}
