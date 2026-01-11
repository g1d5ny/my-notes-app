import { Close, Copy, Cut, Delete, Duplicate } from "@/assets/icons/svg/icon"
import { Styles } from "@/constant/Style"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { appBarAtom, modalAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, MemoType } from "@/type"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"

export const FolderActionAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const setModal = useSetAtom(modalAtom)
    const { deleteFile, deleteFolder } = useDeleteMemo()
    const { createFile, duplicateFolder } = useCreateMemo()

    const icons = [
        {
            icon: <Copy theme={theme} />,
            onPress: () => setAppBar(AppBar.PASTE)
        },
        {
            icon: <Duplicate theme={theme} />,
            onPress: () => {
                if (selectedMemo?.memo.type === MemoType.FILE) {
                    createFile({ title: selectedMemo?.memo.title ?? "", content: selectedMemo?.memo.content ?? "", parentId: selectedMemo?.memo.parentId ?? null })
                } else {
                    duplicateFolder({ folderId: selectedMemo?.memo.id ?? 0, newParentId: selectedMemo?.memo.parentId ?? null })
                }
                setSelectedMemo(null)
                setAppBar(AppBar.MAIN)
                Toast.show({
                    text1: "복제 되었습니다.",
                    type: "customToast",
                    position: "bottom",
                    visibilityTime: 3000
                })
            }
        },
        {
            icon: <Cut theme={theme} />,
            onPress: () => {
                setAppBar(AppBar.MAIN)
                Toast.show({
                    text1: "메모가 잘라내기 되었습니다. 원하시는 곳에 붙여넣어주세요!",
                    type: "customToast",
                    position: "bottom",
                    visibilityTime: 3000
                })
            }
        },
        {
            icon: <Delete theme={theme} />,
            onPress: () =>
                setModal(prev => ({
                    ...prev,
                    visible: true,
                    message: "정말 삭제하시겠습니까?",
                    onConfirm: () => {
                        if (selectedMemo?.memo.type === MemoType.FILE) {
                            deleteFile({ id: selectedMemo?.memo.id ?? 0, parentId: selectedMemo?.memo.parentId ?? null })
                        } else {
                            deleteFolder({ id: selectedMemo?.memo.id ?? 0, parentId: selectedMemo?.memo.parentId ?? null })
                        }
                        setAppBar(AppBar.MAIN)
                        setSelectedMemo(null)
                    },
                    confirmText: "삭제"
                }))
        }
    ]

    useEffect(() => {
        return () => {
            setSelectedMemo(null)
        }
    }, [])

    return (
        <View style={styles.row}>
            <Pressable
                onPress={() => {
                    setAppBar(AppBar.MAIN)
                    setSelectedMemo(null)
                }}
            >
                <Close theme={theme} />
            </Pressable>
            <View style={[Styles.row, styles.right]}>
                {icons.map(({ icon, onPress }, index) => (
                    <Pressable key={index} onPress={onPress}>
                        {icon}
                    </Pressable>
                ))}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    right: {
        gap: 8
    },
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})
