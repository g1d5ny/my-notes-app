import { ContentInput } from "@/component/input/ContentInput"
import { TitleInput } from "@/component/input/TitleInput"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { editModeAtom, modalAtom } from "@/store"
import { FormValues, MemoType } from "@/type"
import { useGlobalSearchParams } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useAtom, useSetAtom } from "jotai"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Keyboard, StyleSheet } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import Toast from "react-native-toast-message"
import { FileCreateAppBar } from "./appBar/FileCreateAppBar"

let lastTapTime = 0

interface FileDetailParams {
    id: number
    title: string
    content: string
    parentId: number | null
}
export const FileDetail = ({ id, title, content, parentId }: FileDetailParams) => {
    const db = useSQLiteContext()
    const setModal = useSetAtom(modalAtom)
    const { updateFileTitle, updateFileContent } = useUpdateMemo()
    const params = useGlobalSearchParams()
    const [editMode, setEditMode] = useAtom(editModeAtom)
    const currentId = params.id ? Number(params.id) : 0
    const editable = editMode.id === currentId && editMode.isEditMode

    const { control, getValues, handleSubmit, watch, resetField, setFocus } = useForm<FormValues>({
        defaultValues: { title, content }
    })

    const titleText = watch("title")
    const contentText = watch("content")

    const updateViewedAt = async () => {
        const now = Math.floor(Date.now() / 1000)
        await db.runAsync(`UPDATE ${MemoType.FILE} SET viewedAt = ? WHERE id = ?`, [now, id])
    }

    const handleTouchEnd = () => {
        const now = Date.now()
        if (now - lastTapTime < 300) {
            setEditMode({ id: currentId, isEditMode: true })
        }
        lastTapTime = now
    }

    const back = () => {
        setEditMode({ id: 0, isEditMode: false })
        Keyboard.dismiss()
        resetField("title", { defaultValue: title })
        resetField("content", { defaultValue: content })
    }

    const close = () => {
        setModal({ visible: true, message: "뒤로 가시면 작성된 글이 삭제됩니다.\n뒤로 가시겠습니까?", onConfirm: back, confirmText: "뒤로 가기" })
        Keyboard.dismiss()
    }

    const submitFile = () => {
        Keyboard.dismiss()
        if (titleText.length === 0) {
            Toast.show({
                text1: "제목을 입력해주세요.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
            return
        }
        if (contentText.length === 0) {
            Toast.show({
                text1: "내용을 입력해주세요.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
            return
        }
        updateFileTitle({ title: titleText, memoId: id, parentId })
        updateFileContent({ content: contentText, memoId: id, parentId })
        setEditMode({ id: 0, isEditMode: false })
    }

    useEffect(() => {
        updateViewedAt()
    }, [])

    return (
        <>
            {editMode.isEditMode && <FileCreateAppBar textLength={contentText.length} submitFile={submitFile} close={close} back={back} />}
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' contentContainerStyle={styles.container} onTouchEnd={handleTouchEnd}>
                <Controller
                    control={control}
                    name='title'
                    rules={{ required: true }}
                    render={({ field: { onChange, value, ref } }) => <TitleInput ref={ref} value={value} onChangeText={onChange} onSubmitEditing={() => setFocus("content")} editable={editable} />}
                />
                <Controller control={control} name='content' rules={{ required: true }} render={({ field: { onChange, value, ref } }) => <ContentInput ref={ref} value={value} onChangeText={onChange} editable={editable} />} />
            </KeyboardAwareScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 16,
        gap: 12
    }
})
