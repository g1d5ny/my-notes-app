import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { useBackHandler } from "@/hook/useBackHandler"
import { appBarAtom, modalAtom } from "@/store"
import { AppBar, MemoType } from "@/type"
import { useLocalSearchParams } from "expo-router"
import { useSetAtom } from "jotai"
import { useEffect } from "react"
import { BackHandler } from "react-native"

export default function FolderScreen() {
    const params = useLocalSearchParams()
    const currentType = params.type as MemoType
    const setAppBar = useSetAtom(appBarAtom)
    const setModal = useSetAtom(modalAtom)

    useEffect(() => {
        setAppBar(prev => (prev === AppBar.PASTE ? prev : currentType === MemoType.FILE ? AppBar.FILE : AppBar.MAIN))
    }, [currentType])

    useBackHandler(() => {
        if (Object.keys(params).length === 0) {
            setModal({
                visible: true,
                message: "폴더노트를 종료하시겠습니까?",
                onConfirm: BackHandler.exitApp,
                confirmText: "종료"
            })
            return true
        }
        return false
    })

    return currentType === MemoType.FILE ? <FileDetail id={Number(params.id)} title={String(params.title)} content={String(params.content)} parentId={Number(params.parentId ?? 0)} /> : <FolderDetail />
}
