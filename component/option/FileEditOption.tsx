import { AndroidDots, IosDots } from "@/assets/icons/svg/icon"
import { CopyOption, DeleteOption, EditOption, ExportOption, InfoOption } from "@/assets/icons/svg/option/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext, useState } from "react"
import { Platform } from "react-native"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

interface FileEditOptionProps {
    editFile: () => void
    showDeleteModal: () => void
    copyFile: () => void
    exportFile: () => void
    showInfoModal: () => void
}
export const FileEditOption = ({ editFile, showDeleteModal, copyFile, exportFile, showInfoModal }: FileEditOptionProps) => {
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
            title: "사본 만들기",
            trailingIcon: <CopyOption theme={theme} />,
            disabled: false,
            onPress: () => {
                copyFile()
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

    const Dots = () => {
        return Platform.OS === "android" ? <AndroidDots theme={theme} /> : <IosDots theme={theme} />
    }

    return <OptionMenu anchor={<Dots />} list={fileEditOptionList} menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
}
