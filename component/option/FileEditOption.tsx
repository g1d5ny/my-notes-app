import { DeleteOption, ExportOption, InfoOption } from "@/assets/icons/svg/option/icon"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { infoModalVisibleAtom, modalAtom, themeAtom } from "@/store"
import { useGlobalSearchParams } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { useState } from "react"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

interface FileEditOptionProps {
    exportFile: () => void
}
export const FileEditOption = ({ exportFile }: FileEditOptionProps) => {
    const theme = useAtomValue(themeAtom)
    const setModal = useSetAtom(modalAtom)
    const setInfoModalVisible = useSetAtom(infoModalVisibleAtom)
    const [menuVisible, setMenuVisible] = useState(false)
    const params = useGlobalSearchParams()
    const currentId = params.id ? Number(params?.id) : 0
    const { deleteFile } = useDeleteMemo()

    const fileEditOptionList: OptionMenuList[] = [
        {
            title: "삭제하기",
            trailingIcon: <DeleteOption theme={theme} />,
            disabled: false,
            onPress: () => {
                setModal({
                    visible: true,
                    message: "정말 삭제하시겠습니까?",
                    onConfirm: () => {
                        deleteFile({ id: currentId, parentId: params.parentId ? Number(params.parentId) : null })
                    },
                    confirmText: "삭제"
                })
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "내보내기",
            trailingIcon: <ExportOption theme={theme} />,
            disabled: false,
            onPress: () => {
                exportFile()
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "정보",
            trailingIcon: <InfoOption theme={theme} />,
            disabled: false,
            onPress: () => {
                setInfoModalVisible(true)
                setMenuVisible(false)
            },
            hasDivider: false
        }
    ]

    return <OptionMenu list={fileEditOptionList} menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
}
