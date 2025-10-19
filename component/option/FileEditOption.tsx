import { DeleteOption, EditOption, ExportOption, InfoOption } from "@/assets/icons/svg/option/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

interface FileEditOptionProps {
    editFile: () => void
    showDeleteModal: () => void
    exportFile: () => void
    showInfoModal: () => void
}
export const FileEditOption = ({ editFile, showDeleteModal, exportFile, showInfoModal }: FileEditOptionProps) => {
    const { theme } = useContext(ThemeContext)
    const [menuVisible, setMenuVisible] = useState(false)

    const fileEditOptionList: OptionMenuList[] = [
        {
            title: "편집하기",
            trailingIcon: <EditOption theme={theme} />,
            disabled: false,
            onPress: () => {
                editFile()
                setMenuVisible(false)
            },
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "삭제하기",
            trailingIcon: <DeleteOption theme={theme} />,
            disabled: false,
            onPress: () => {
                showDeleteModal()
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
                showInfoModal()
                setMenuVisible(false)
            },
            hasDivider: false
        }
    ]

    return <OptionMenu list={fileEditOptionList} menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
}
