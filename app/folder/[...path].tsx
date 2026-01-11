import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { appBarAtom } from "@/store"
import { AppBar, MemoType } from "@/type"
import { useGlobalSearchParams } from "expo-router"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

export default function FolderScreen() {
    const params = useGlobalSearchParams()
    const currentType = params.type as MemoType
    const setAppBar = useSetAtom(appBarAtom)

    useEffect(() => {
        setAppBar(currentType === MemoType.FILE ? AppBar.FILE : AppBar.MAIN)
    }, [currentType])

    return currentType === MemoType.FILE ? <FileDetail id={Number(params.id)} title={String(params.title)} content={String(params.content)} parentId={Number(params.parentId ?? 0)} /> : <FolderDetail />
}
