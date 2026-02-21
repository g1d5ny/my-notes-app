import { FontStyles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { forwardRef } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export const ContentInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
    const theme = useAtomValue(themeAtom)

    return (
        <TextInput
            ref={ref}
            style={[FontStyles.Content, styles.content, { color: theme.text }]}
            placeholder='내용을 입력해주세요.'
            placeholderTextColor={theme.gray}
            scrollEnabled={false}
            multiline
            textAlignVertical='top'
            maxLength={10000}
            {...props}
        />
    )
})

ContentInput.displayName = "ContentInput"

const styles = StyleSheet.create({
    content: {
        flex: 1,
        textAlignVertical: "top"
    }
})
