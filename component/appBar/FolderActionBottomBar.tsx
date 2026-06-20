import { Copy, Cut, Delete, Duplicate } from "@/assets/icons/svg/icon"
import { Elevation, FontStyles, Spacing } from "@/constant/Style"
import { hapticPress, hapticWarning } from "@/function/haptics"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { appBarAtom, modalAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, MemoType, SelectedMemoType } from "@/type"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { ReactNode } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"

const DANGER = "#FF3B30"

interface Action {
    label: string
    icon: ReactNode
    danger?: boolean
    onPress: () => void
}

export const FolderActionBottomBar = () => {
    const theme = useAtomValue(themeAtom)
    const appBar = useAtomValue(appBarAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const setModal = useSetAtom(modalAtom)
    const { deleteFile, deleteFolder } = useDeleteMemo()
    const { createFile, duplicateFolder } = useCreateMemo()
    const { bottom } = useSafeAreaInsets()
    const disabled = selectedMemo.memo.length === 0

    if (appBar !== AppBar.FOLDER_ACTION) {
        return null
    }

    const actions: Action[] = [
        {
            label: "복사",
            icon: <Copy theme={theme} />,
            onPress: () => {
                hapticPress()
                setAppBar(AppBar.PASTE)
            }
        },
        {
            label: "복제",
            icon: <Duplicate theme={theme} />,
            onPress: () => {
                hapticPress()
                selectedMemo.memo.forEach(item => {
                    if (item.type === MemoType.FILE) {
                        createFile({ title: item.title ?? "", content: item.content ?? "", parentId: item.parentId ?? null })
                    } else {
                        duplicateFolder({ folderId: item.id ?? 0, newParentId: item.parentId ?? null })
                    }
                })
                setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                setAppBar(AppBar.MAIN)
                Toast.show({ text1: "복제 되었습니다.", type: "customToast", position: "bottom", visibilityTime: 3000 })
            }
        },
        {
            label: "잘라내기",
            icon: <Cut theme={theme} />,
            onPress: () => {
                hapticPress()
                setSelectedMemo(prev => ({ ...prev, type: SelectedMemoType.CUT }))
                setAppBar(AppBar.PASTE)
            }
        },
        {
            label: "삭제",
            icon: <Delete theme={theme} />,
            danger: true,
            onPress: () => {
                hapticWarning()
                setModal(prev => ({
                    ...prev,
                    visible: true,
                    message: "정말 삭제하시겠습니까?",
                    onConfirm: () => {
                        selectedMemo.memo.forEach(item => {
                            if (item.type === MemoType.FILE) {
                                deleteFile({ id: item.id ?? 0, parentId: item.parentId ?? null })
                            } else {
                                deleteFolder({ id: item.id ?? 0, parentId: item.parentId ?? null })
                            }
                        })
                        setAppBar(AppBar.MAIN)
                        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                    },
                    confirmText: "삭제"
                }))
            }
        }
    ]

    return (
        <View style={[styles.bar, Elevation.high, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: bottom + Spacing.sm }]}>
            {actions.map((action, index) => (
                <Pressable key={index} style={[styles.action, { opacity: disabled ? 0.35 : 1 }]} disabled={disabled} onPress={action.onPress}>
                    {action.icon}
                    <Text style={[FontStyles.Caption, styles.label, { color: action.danger ? DANGER : theme.textSecondary }]}>{action.label}</Text>
                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    bar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "flex-start",
        paddingTop: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    action: {
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.xs,
        minWidth: 64
    },
    label: {
        marginTop: 2
    }
})
