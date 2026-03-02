import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { useBackHandler } from "@/hook/useBackHandler"
import { appBarAtom, modalAtom, searchInputAtom } from "@/store"
import { AppBar, MemoType } from "@/type"
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router"
import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"
import { BackHandler } from "react-native"

export default function FolderScreen() {
    const params = useLocalSearchParams()
    const globalParams = useGlobalSearchParams()
    const currentType = params.type as MemoType
    const setAppBar = useSetAtom(appBarAtom)
    const setModal = useSetAtom(modalAtom)
    const [searchInput, setSearchInput] = useAtom(searchInputAtom)

    useEffect(() => {
        setAppBar(prev => (prev === AppBar.PASTE ? prev : currentType === MemoType.FILE ? AppBar.FILE : AppBar.MAIN))
    }, [currentType])

    useBackHandler(() => {
        if (searchInput.visible) {
            setSearchInput({ value: "", visible: false })
            return true
        }
        if (Object.keys(globalParams).length === 0) {
            setModal({
                visible: true,
                message: "폴더노트를 종료하시겠습니까?",
                onConfirm: BackHandler.exitApp,
                confirmText: "종료"
            })
            return true
        } else {
            setAppBar(AppBar.MAIN)
        }
        return false
    })

    return currentType === MemoType.FILE ? <FileDetail id={Number(params.id)} title={String(params.title)} content={String(params.content)} parentId={Number(params.parentId ?? 0)} /> : <FolderDetail />
}
