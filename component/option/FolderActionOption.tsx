import { HorizontalDots, VerticalDots } from "@/assets/icons/svg/icon"
import { CopyOption, DeleteOption, EditOption, ExportOption, InfoOption } from "@/assets/icons/svg/option/icon"
import { ThemeContext } from "@/context/ThemeContext"
import { useContext } from "react"
import { Platform } from "react-native"
import { OptionMenu, OptionMenuList } from "../OptionMenu"

export const FolderActionOption = () => {
    const { theme } = useContext(ThemeContext)

    const optionList: OptionMenuList[] = [
        {
            title: "편집하기",
            trailingIcon: <EditOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "삭제하기",
            trailingIcon: <DeleteOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "사본 만들기",
            trailingIcon: <CopyOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "내보내기",
            trailingIcon: <ExportOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            dividerWidth: 1,
            hasDivider: true
        },
        {
            title: "정보",
            trailingIcon: <InfoOption theme={theme} />,
            disabled: false,
            onPress: () => {},
            hasDivider: false
        }
    ]

    const Dots = () => {
        return Platform.OS === "android" ? <VerticalDots theme={theme} /> : <HorizontalDots theme={theme} />
    }
    return <OptionMenu anchor={<Dots />} list={optionList} />
}
