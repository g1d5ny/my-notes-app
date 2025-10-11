import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { forwardRef, useContext } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export const ContentInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
    const { theme } = useContext(ThemeContext)

    return (
        <TextInput
            ref={ref}
            style={[FontStyles.SubTitle, styles.content, { color: theme.text }]}
            placeholder='내용을 입력해주세요.'
            placeholderTextColor={theme.gray}
            scrollEnabled={false}
            multiline
            textAlignVertical='top'
            maxLength={1000}
            {...props}
        />
    )
})

ContentInput.displayName = "ContentInput"

const styles = StyleSheet.create({
    content: {
        textAlignVertical: "top"
    }
})
