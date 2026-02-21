import { AndroidBack, Close, IosBack, Paste } from "@/assets/icons/svg/icon"
import { Styles } from "@/constant/Style"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { useDeleteMemo } from "@/hook/useDeleteMemo"
import { appBarAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, MemoType, SelectedMemoType } from "@/type"
import { useGlobalSearchParams, usePathname, useRouter } from "expo-router"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useState } from "react"
import { Platform, Pressable, StyleSheet, View } from "react-native"
import Toast from "react-native-toast-message"

export const PasteAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const router = useRouter()
    const pathname = usePathname()
    const [canBack, setCanBack] = useState(pathname.split("/").length > 2)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const params = useGlobalSearchParams()
    const { createFileFn, duplicateFolder } = useCreateMemo()
    const { deleteFileFn, deleteFolderFn } = useDeleteMemo()

    const paste = async () => {
        const findSamePathMemo = selectedMemo.memo.find(memo => Number(params.id) === memo.id && Number(params.parentId) === memo.parentId)
        if (findSamePathMemo) {
            Toast.show({
                text1: "같은 위치에 붙여넣기 할 수 없습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
            return
        }
        if (params.type === MemoType.FILE) {
            Toast.show({
                text1: "파일에 붙여넣기 할 수 없습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
            return
        }
        if (selectedMemo) {
            selectedMemo.memo.forEach(async selectedMemo => {
                if (selectedMemo.type === MemoType.FILE) {
                    await createFileFn({ title: selectedMemo.title ?? "", content: selectedMemo.content ?? "", parentId: params.id ? Number(params.id) : null })
                } else {
                    await duplicateFolder({ folderId: selectedMemo.id ?? 0, newParentId: params.id ? Number(params.id) : null })
                }
            })

            setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
            setAppBar(AppBar.MAIN)

            Toast.show({
                text1: "붙여넣기 되었습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 5000
            })
        }
    }

    const cancel = () => {
        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
        setAppBar(AppBar.MAIN)
    }

    useEffect(() => {
        setCanBack(pathname.split("/").length > 2)
    }, [pathname])

    return (
        <View style={styles.row}>
            <View style={styles.left}>
                {canBack && (
                    <Pressable style={styles.back} onPress={() => router.back()}>
                        {Platform.OS === "ios" ? <IosBack theme={theme} /> : <AndroidBack theme={theme} />}
                    </Pressable>
                )}
            </View>
            <View style={[Styles.row, styles.right]}>
                <Pressable onPress={cancel}>
                    <Close theme={theme} />
                </Pressable>
                <Pressable onPress={paste}>
                    <Paste theme={theme} />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    back: {
        alignSelf: "flex-start"
    },
    right: {
        alignItems: "center",
        alignSelf: "flex-end",
        gap: 8
    },
    left: {
        flex: 1
    }
})
