import { FontStyles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { forwardRef } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export const TitleInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
    const theme = useAtomValue(themeAtom)

    return <TextInput ref={ref} style={[FontStyles.Title, styles.title, { color: theme.text }]} placeholder='제목을 입력해주세요.' placeholderTextColor={theme.gray} returnKeyType='next' numberOfLines={1} maxLength={30} {...props} />
})

TitleInput.displayName = "TitleInput"

const styles = StyleSheet.create({
    title: {
        textAlignVertical: "center"
    }
})
