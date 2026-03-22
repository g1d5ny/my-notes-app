import { FontStyles } from "@/constant/Style"
import { themeAtom } from "@/store"
import { BottomSheetTextInput } from "@gorhom/bottom-sheet"
import { BottomSheetTextInputProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput"
import { useAtomValue } from "jotai"
import { forwardRef, useState } from "react"
import { StyleSheet, TextInput, TextInputProps } from "react-native"

export const ContentInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
    const theme = useAtomValue(themeAtom)
    const [height, setHeight] = useState(100)

    return (
        <TextInput
            ref={ref}
            style={[FontStyles.Body, styles.content, { color: theme.text, minHeight: height }]}
            placeholder='내용을 입력해주세요.'
            placeholderTextColor={theme.gray}
            scrollEnabled={false}
            multiline
            textAlignVertical='top'
            maxLength={10000}
            onContentSizeChange={e => setHeight(e.nativeEvent.contentSize.height)}
            {...props}
        />
    )
})

export const BottomSheetContentInput = (props: BottomSheetTextInputProps) => {
    const theme = useAtomValue(themeAtom)

    return <BottomSheetTextInput style={[FontStyles.Body, styles.content, { color: theme.text }]} placeholder='내용을 입력해주세요.' placeholderTextColor={theme.gray} multiline textAlignVertical='top' maxLength={10000} {...props} />
}

ContentInput.displayName = "ContentInput"

const styles = StyleSheet.create({
    content: {
        flex: 1,
        textAlignVertical: "top"
    }
})
