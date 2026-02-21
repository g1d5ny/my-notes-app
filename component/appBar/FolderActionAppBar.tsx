import { Close, Copy, Cut, Delete, Duplicate } from "@/assets/icons/svg/icon"
import { Styles } from "@/constant/Style"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { appBarAtom, modalAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, MemoType, SelectedMemoType } from "@/type"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Pressable, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"

export const FolderActionAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const setModal = useSetAtom(modalAtom)
    const { deleteFile, deleteFolder } = useDeleteMemo()
    const { createFile, duplicateFolder } = useCreateMemo()
    const disabled = selectedMemo.memo.length === 0

    const icons = [
        {
            icon: <Copy theme={theme} />,
            onPress: () => setAppBar(AppBar.PASTE)
        },
        {
            icon: <Duplicate theme={theme} />,
            onPress: () => {
                selectedMemo.memo.forEach(selectedMemo => {
                    if (selectedMemo.type === MemoType.FILE) {
                        createFile({ title: selectedMemo.title ?? "", content: selectedMemo.content ?? "", parentId: selectedMemo.parentId ?? null })
                    } else {
                        duplicateFolder({ folderId: selectedMemo.id ?? 0, newParentId: selectedMemo.parentId ?? null })
                    }
                })
                setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
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
                setSelectedMemo(prev => ({ ...prev, type: SelectedMemoType.CUT }))
                setAppBar(AppBar.PASTE)
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
                        selectedMemo.memo.forEach(selectedMemo => {
                            if (selectedMemo.type === MemoType.FILE) {
                                deleteFile({ id: selectedMemo.id ?? 0, parentId: selectedMemo.parentId ?? null })
                            } else {
                                deleteFolder({ id: selectedMemo.id ?? 0, parentId: selectedMemo.parentId ?? null })
                            }
                        })
                        setAppBar(AppBar.MAIN)
                        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                    },
                    confirmText: "삭제"
                }))
        }
    ]

    return (
        <View style={styles.row}>
            <Pressable
                hitSlop={10}
                onPress={() => {
                    setAppBar(AppBar.MAIN)
                    setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                }}
            >
                <Close theme={theme} />
            </Pressable>
            <View style={[Styles.row, styles.right]}>
                {icons.map(({ icon, onPress }, index) => (
                    <Pressable key={index} onPress={onPress} hitSlop={10} disabled={disabled}>
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
