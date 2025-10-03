import { FileCreateAppBar } from "@/component/appBar/FileCreateAppBar"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"
import { forwardRef, useContext, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { StyleSheet, TextInput } from "react-native"
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
    }

    const close = () => {
        setShowDeleteModal(true)
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
                style={styles.container}
            >
                <Controller
                    control={control}
                    name='title'
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[FontStyles.Title, styles.title, { color: theme.text }]}
                            placeholder='제목을 입력해주세요.'
                            placeholderTextColor={theme.gray}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            returnKeyType='next'
                            onSubmitEditing={() => contentRef.current?.focus()}
                            autoFocus
                            multiline={false}
                            numberOfLines={1}
                            maxLength={30}
                        />
                    )}
                />
                <BottomSheetScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingBottom: bottom }]} showsVerticalScrollIndicator>
                    <Controller
                        control={control}
                        name='content'
                        rules={{ required: true }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                                ref={contentRef}
                                style={[FontStyles.SubTitle, { color: theme.text }]}
                                placeholder='내용을 입력해주세요.'
                                placeholderTextColor={theme.gray}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                scrollEnabled={false}
                                multiline
                                textAlignVertical='top'
                                maxLength={1000}
                            />
                        )}
                    />
                </BottomSheetScrollView>
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
    title: {
        textAlignVertical: "center",
        margin: 16
    },
    container: {
        flex: 1
    }
})
