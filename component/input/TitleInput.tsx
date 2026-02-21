import { FontStyles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { useAtomValue } from "jotai"
import { forwardRef } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export const TitleInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
    const theme = useAtomValue(themeAtom)

    const handleChangeText = (text: string) => {
        const singleLineText = text.replace(/[\r\n]/g, "")
        props.onChangeText?.(singleLineText)
    }

    return (
        <TextInput
            ref={ref}
            style={[FontStyles.Title, styles.title, { color: theme.text }]}
            placeholder='제목을 입력해주세요.'
            placeholderTextColor={theme.gray}
            returnKeyType='next'
            maxLength={30}
            multiline
            {...props}
            onChangeText={handleChangeText}
        />
    )
})

TitleInput.displayName = "TitleInput"

const styles = StyleSheet.create({
    title: {
        width: "100%",
        textAlignVertical: "center"
    }
})
