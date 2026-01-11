// component/MemoList.tsx
import { EmptyFolder, File, FilledFolder } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { useCheckFilledMemo } from "@/hook/useCheckFilledMemo"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { appBarAtom, selectedMemoAtom, sortAtom, themeAtom } from "@/store"
import { AppBar, Memo, MemoType, SelectedMemoType } from "@/type"
import { useQueryClient } from "@tanstack/react-query"
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router"
import { useAtom, useAtomValue } from "jotai"
import { useMemo } from "react"
import { Controller, FieldPath, useForm } from "react-hook-form"
import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native"

type FormValues = {
    title: string
}

const ITEM_WIDTH = 76
const PADDING = 16

const getItemsPerRow = () => {
    const screenWidth = Dimensions.get("window").width
    const padding = PADDING * 2 // 좌우 패딩 16 * 2
    const availableWidth = screenWidth - padding
    const itemWidth = ITEM_WIDTH + PADDING // 아이템 너비 + gap
    return Math.floor(availableWidth / itemWidth)
}

export const FolderList = () => {
    const theme = useAtomValue(themeAtom)
    const sortType = useAtomValue(sortAtom)
    const queryClient = useQueryClient()
    const params = useLocalSearchParams()
    const currentPath = usePathname()
    const [appBar, setAppBar] = useAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const { updateFolderTitle, updateFileTitle } = useUpdateMemo()
    const currentId = params.id ? Number(params?.id) : 0
    const memos = queryClient.getQueryData<Memo[]>([MemoType.FOLDER, currentId, sortType]) ?? []
    const { data: filledFolder = [] } = useCheckFilledMemo(memos)

    const { control } = useForm<FormValues>({
        defaultValues: { title: "" }
    })

    const itemsPerRow = useMemo(() => getItemsPerRow(), [])

    const open = (id: number, type: MemoType, title: string, content: string | undefined, parentId: number | null) => {
        const path = (currentPath + `/${title}`) as RelativePathString
        router.push({ pathname: path, params: { type, id, title, content, parentId } })
    }

    const selectMemo = (memo: Memo) => {
        setSelectedMemo({ memo, type: SelectedMemoType.COPY })
        setAppBar(AppBar.FOLDER_ACTION)
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <Pressable
                    style={styles.pressContainer}
                    onPress={() => {
                        setSelectedMemo(null)
                        setAppBar(AppBar.MAIN)
                    }}
                >
                    {memos.map((memo, index) => {
                        const { id, title, type, content, parentId } = memo
                        const selected = selectedMemo?.memo.id === id && selectedMemo.memo?.type === type
                        return (
                            <View key={index} style={[styles.item, { opacity: selected ? 0.5 : 1 }]}>
                                <Pressable disabled={selected} onLongPress={() => selectMemo(memo)} onPress={() => open(id, type, title, content, parentId)}>
                                    {type === MemoType.FILE ? <File /> : filledFolder[id] ? <FilledFolder /> : <EmptyFolder />}
                                </Pressable>
                                <Pressable disabled={selected} style={styles.titleContainer} onPress={() => open(id, type, title, content, parentId)}>
                                    <Controller
                                        name={`${id}-${type}` as FieldPath<FormValues>}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, onBlur, value } }) => (
                                            <TextInput
                                                onBlur={async () => {
                                                    onBlur()
                                                    const currentValue = value
                                                    if (currentValue && currentValue !== title) {
                                                        if (type === MemoType.FILE) {
                                                            updateFileTitle({ title: currentValue, memoId: id, parentId: parentId ?? 0 })
                                                        } else {
                                                            updateFolderTitle({ title: currentValue, memoId: id, parentId: parentId ?? 0 })
                                                        }
                                                    } else {
                                                        onChange(title)
                                                    }
                                                }}
                                                onChangeText={onChange}
                                                value={value ?? title}
                                                style={[styles.title, { color: theme.text }]}
                                                scrollEnabled={false}
                                                returnKeyType='done'
                                            />
                                        )}
                                    />
                                </Pressable>
                            </View>
                        )
                    })}
                    {Array.from({ length: Math.max(0, itemsPerRow - (memos.length % itemsPerRow)) }).map((_, index) => {
                        return <View key={index} style={styles.item} />
                    })}
                </Pressable>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: "100%",
        marginTop: 8
    },
    title: {
        width: "100%",
        maxHeight: 40,
        padding: 4,
        borderRadius: 4,
        textAlign: "center",
        textAlignVertical: "center",
        backgroundColor: "rgba(221, 221, 221, 0.2)",
        ...FontStyles.BodySmall
    },
    container: {
        flex: 1,
        padding: 16,
        gap: 12
    },
    pressContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: 16,
        flexGrow: 1
    },
    contentContainerStyle: {
        flex: 1
    },
    item: {
        width: 76,
        alignItems: "center"
    }
})
