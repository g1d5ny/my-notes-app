import { FileCreateAppBar } from "@/component/appBar/FileCreateAppBar"
import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { modalAtom, themeAtom } from "@/store"
import { FormValues } from "@/type"
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { useAtomValue, useSetAtom } from "jotai"
import { forwardRef } from "react"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const AddFile = forwardRef<BottomSheetModalMethods>((_, ref) => {
    const theme = useAtomValue(themeAtom)
    const setModal = useSetAtom(modalAtom)
    const { top, bottom } = useSafeAreaInsets()

    const { control, handleSubmit, resetField, watch, setFocus } = useForm<FormValues>({
        defaultValues: { title: "", content: "" }
    })

    const contentText = watch("content")

    const back = () => {
        Keyboard.dismiss()
        if (ref && typeof ref !== "function" && ref.current) {
            ref.current.close()
        }
        resetField("title")
        resetField("content")
    }

    const close = () => {
        setModal({ visible: true, message: "뒤로 가시면 작성된 글이 삭제됩니다.\n뒤로 가시겠습니까?", onConfirm: back, confirmText: "뒤로 가기" })
        Keyboard.dismiss()
    }

    return (
        <BottomSheetModal
            ref={ref}
            topInset={top}
            handleComponent={() => <FileCreateAppBar textLength={contentText.length} handleSubmit={handleSubmit} close={close} back={back} />}
            backgroundStyle={{ backgroundColor: theme.background }}
            snapPoints={["100%"]}
            enableDynamicSizing={false}
            android_keyboardInputMode='adjustPan'
            keyboardBehavior='extend'
            keyboardBlurBehavior='none'
            enablePanDownToClose
        >
            <View style={[styles.container, { paddingBottom: bottom }]}>
                <Controller
                    control={control}
                    name='title'
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => <TitleInput value={value} onBlur={onBlur} onChangeText={onChange} onSubmitEditing={() => setFocus("content")} />}
                />
                <BottomSheetScrollView showsVerticalScrollIndicator contentContainerStyle={{ flex: 1 }}>
                    <Controller control={control} name='content' rules={{ required: true }} render={({ field: { onChange, onBlur, value, ref } }) => <ContentInput ref={ref} onBlur={onBlur} onChangeText={onChange} value={value} />} />
                </BottomSheetScrollView>
            </View>
        </BottomSheetModal>
    )
})

AddFile.displayName = "AddFile"

const styles = StyleSheet.create({
    contentContainer: {
        marginHorizontal: 16
    },
    container: {
        flex: 1,
        margin: 16,
        gap: 12
    }
})
