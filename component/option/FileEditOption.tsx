import { HorizontalDots, VerticalDots } from "@/assets/icons/svg/icon"
import { CopyOption, DeleteOption, ExportOption, InfoOption, SortOption } from "@/assets/icons/svg/option/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { Platform } from "react-native"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

interface FileEditOptionProps {
    setDeleteModalVisible: Dispatch<SetStateAction<boolean>>
    setInfoModalVisible: Dispatch<SetStateAction<boolean>>
}
export const FileEditOption = ({ setDeleteModalVisible, setInfoModalVisible }: FileEditOptionProps) => {
    const { theme } = useContext(ThemeContext)
    const [menuVisible, setMenuVisible] = useState(false)

    const fileEditOptionList: OptionMenuList[] = [
        {
            title: "편집하기",
            trailingIcon: <SortOption theme={theme} />,
            disabled: false,
            onPress: () => {
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
                setDeleteModalVisible(true)
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

    const Dots = () => {
        return Platform.OS === "android" ? <VerticalDots theme={theme} /> : <HorizontalDots theme={theme} />
    }

    return <OptionMenu anchor={<Dots />} list={fileEditOptionList} menuVisible={menuVisible} setMenuVisible={setMenuVisible} />
}
