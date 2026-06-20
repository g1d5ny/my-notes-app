import { FileDetail } from "@/component/FileDetail"
import { FolderDetail } from "@/component/FolderDetail"
import { useBackHandler } from "@/hook/useBackHandler"
import { appBarAtom, modalAtom, searchInputAtom } from "@/store"
import { AppBar, MemoType } from "@/type"
import { useFocusEffect, useGlobalSearchParams, useLocalSearchParams } from "expo-router"
import { useAtom, useSetAtom } from "jotai"
import { useCallback } from "react"
import { BackHandler } from "react-native"

export default function FolderScreen() {
    const params = useLocalSearchParams()
    const globalParams = useGlobalSearchParams()
    const currentType = params.type as MemoType
    const setAppBar = useSetAtom(appBarAtom)
    const setModal = useSetAtom(modalAtom)
    const [searchInput, setSearchInput] = useAtom(searchInputAtom)

    // 포커스된 화면 기준으로 앱바 종류를 확정 → 화면별 마운트/언마운트 타이밍 경쟁 없이
    // (iOS 엣지 스와이프 백 포함) 항상 현재 화면 타입에 맞는 앱바가 뜬다.
    useFocusEffect(
        useCallback(() => {
            setAppBar(prev => (prev === AppBar.PASTE ? prev : currentType === MemoType.FILE ? AppBar.FILE : AppBar.MAIN))
        }, [currentType])
    )

    useBackHandler(() => {
        if (searchInput.visible) {
            setSearchInput({ value: "", visible: false })
            return true
        }
        if (Object.keys(globalParams).length === 0) {
            setModal({
                visible: true,
                message: "오늘모쓰지를 종료하시겠습니까?",
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
