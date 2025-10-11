import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { forwardRef, useContext } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export const TitleInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
    const { theme } = useContext(ThemeContext)

    return (
        <TextInput ref={ref} style={[FontStyles.Title, styles.title, { color: theme.text }]} placeholder='제목을 입력해주세요.' placeholderTextColor={theme.gray} returnKeyType='next' multiline numberOfLines={2} maxLength={30} {...props} />
    )
})

TitleInput.displayName = "TitleInput"

const styles = StyleSheet.create({
    title: {
        textAlignVertical: "center"
    }
})
