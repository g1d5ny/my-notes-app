import { Paste } from "@/assets/icons/svg/icon"
import { Elevation, FontStyles, Radius, Spacing } from "@/constant/Style"
import { hapticSuccess, hapticWarning } from "@/function/haptics"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { appBarAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, MemoType, SelectedMemoType } from "@/type"
import { useGlobalSearchParams } from "expo-router"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import Toast from "react-native-toast-message"

export const PasteBottomBar = () => {
    const theme = useAtomValue(themeAtom)
    const appBar = useAtomValue(appBarAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const { createFileFn, duplicateFolder } = useCreateMemo()
    const { deleteFileFn, deleteFolderFn } = useDeleteMemo()
    const params = useGlobalSearchParams()
    const { bottom } = useSafeAreaInsets()

    if (appBar !== AppBar.PASTE) {
        return null
    }

    const paste = async () => {
        const findSamePathMemo = selectedMemo.memo.find(memo => Number(params.id) === memo.id && Number(params.parentId) === memo.parentId)
        if (findSamePathMemo) {
            hapticWarning()
            Toast.show({ text1: "같은 위치에 붙여넣기 할 수 없습니다.", type: "customToast", position: "bottom", visibilityTime: 3000 })
            return
        }
        if (params.type === MemoType.FILE) {
            hapticWarning()
            Toast.show({ text1: "파일에 붙여넣기 할 수 없습니다.", type: "customToast", position: "bottom", visibilityTime: 3000 })
            return
        }
        selectedMemo.memo.forEach(async memo => {
            if (memo.type === MemoType.FILE) {
                await createFileFn({ title: memo.title ?? "", content: memo.content ?? "", parentId: params.id ? Number(params.id) : null })
            } else {
                await duplicateFolder({ folderId: memo.id ?? 0, newParentId: params.id ? Number(params.id) : null })
            }

            if (selectedMemo.type === SelectedMemoType.CUT) {
                if (memo.type === MemoType.FILE) {
                    deleteFileFn({ id: memo.id ?? 0, parentId: memo.parentId ?? null })
                } else {
                    deleteFolderFn({ id: memo.id ?? 0, parentId: memo.parentId ?? null })
                }
            }
        })

        hapticSuccess()
        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
        setAppBar(AppBar.MAIN)
        Toast.show({ text1: "붙여넣기 되었습니다.", type: "customToast", position: "bottom", visibilityTime: 5000 })
    }

    return (
        <View style={[styles.bar, Elevation.high, { backgroundColor: theme.surface, borderTopColor: theme.border, paddingBottom: bottom + Spacing.sm }]}>
            <Pressable style={[styles.pasteButton, { backgroundColor: theme.accent }]} onPress={paste}>
                <Paste theme={{ ...theme, icon: theme.onAccent }} />
                <Text style={[FontStyles.ButtonText1, { color: theme.onAccent }]}>여기에 붙여넣기</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    bar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderTopWidth: StyleSheet.hairlineWidth
    },
    pasteButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: Spacing.sm,
        height: 52,
        borderRadius: Radius.lg
    }
})
