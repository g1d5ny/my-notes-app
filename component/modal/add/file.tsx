import { FileCreateAppBar } from "@/component/appBar/FileCreateAppBar"
import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { ThemeContext } from "@/context/ThemeContext"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { forwardRef, useContext, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet, TextInput, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { MessageModal } from "../MessageModal"

type FormValues = {
    title: string
    content: string
}

const AddFile = forwardRef<BottomSheetMethods>((props, ref) => {
    const { theme } = useContext(ThemeContext)
    const { bottom } = useSafeAreaInsets()
    const contentRef = useRef<TextInput>(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const { control, handleSubmit, resetField, watch } = useForm<FormValues>({
        defaultValues: { title: "", content: "" }
    })

    const contentText = watch("content")

    const back = () => {
        if (ref && typeof ref !== "function" && ref.current) {
            ref.current.close()
            resetField("title")
            resetField("content")
        }
        Keyboard.dismiss()
    }

    const close = () => {
        setShowDeleteModal(true)
        Keyboard.dismiss()
    }

    return (
        <>
            <BottomSheet
                ref={ref}
                index={-1}
                handleComponent={() => <FileCreateAppBar textLength={contentText.length} handleSubmit={handleSubmit} close={close} back={back} />}
                snapPoints={["100%"]}
                backgroundStyle={{ backgroundColor: theme.background }}
                enablePanDownToClose={true}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={false}
            >
                <View style={[styles.container, { paddingBottom: bottom }]}>
                    <Controller
                        control={control}
                        name='title'
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => <TitleInput onBlur={onBlur} onChangeText={onChange} value={value} onSubmitEditing={() => contentRef.current?.focus()} />}
                    />
                    <BottomSheetScrollView showsVerticalScrollIndicator>
                        <Controller control={control} name='content' rules={{ required: true }} render={({ field: { onChange, onBlur, value } }) => <ContentInput ref={contentRef} onBlur={onBlur} onChangeText={onChange} value={value} />} />
                    </BottomSheetScrollView>
                </View>
            </BottomSheet>
            <MessageModal
                message={"뒤로 가시면 작성된 글이 삭제됩니다.\n뒤로 가시겠습니까?"}
                visible={showDeleteModal}
                onDismiss={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    setShowDeleteModal(false)
                    back()
                }}
                confirmText={"뒤로 가기"}
            />
        </>
    )
})

AddFile.displayName = "AddFile"
export default AddFile

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
