// component/MemoList.tsx
import { EmptyFolder, File, FilledFolder } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { useCheckFilledMemo } from "@/hook/useCheckFilledMemo"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { appBarAtom, searchInputAtom, selectedMemoAtom, sortAtom, themeAtom } from "@/store"
import { AppBar, Memo, MemoType, SelectedMemoType } from "@/type"
import { useQueryClient } from "@tanstack/react-query"
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router"
import { useAtom, useAtomValue } from "jotai"
import { useEffect, useMemo, useState } from "react"
import { Controller, FieldPath, useForm } from "react-hook-form"
import { Dimensions, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"

type FormValues = {
    title: string
}

const ITEM_WIDTH = 76
const PADDING = 16

const getItemsPerRow = () => {
    const screenWidth = Dimensions.get("window").width
    const padding = PADDING * 2 // 좌우 패딩 16 * 2
    const availableWidth = screenWidth - padding
    const itemWidth = ITEM_WIDTH // 아이템 너비 + gap
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
    const [searchInput, setSearchInput] = useAtom(searchInputAtom)
    const { updateFolderTitle, updateFileTitle } = useUpdateMemo()
    const currentId = params.id ? Number(params?.id) : 0
    const memos = queryClient.getQueryData<Memo[]>([MemoType.FOLDER, currentId, sortType]) ?? []
    const { data: filledFolder = [] } = useCheckFilledMemo(memos)
    const [focusedInputKey, setFocusedInputKey] = useState<string | null>(null)
    const { control } = useForm<FormValues>({ defaultValues: { title: "" } })

    const itemsPerRow = useMemo(() => getItemsPerRow(), [])

    const open = (id: number, type: MemoType, title: string, content: string | undefined, parentId: number | null) => {
        const path = (currentPath + `/${title}`) as RelativePathString
        router.push({ pathname: path, params: { type, id, title, content, parentId } })
    }

    const selectMemo = (memo: Memo) => {
        setSelectedMemo(prev => ({ ...prev, memo: [...prev.memo, memo] }))
        setAppBar(AppBar.FOLDER_ACTION)
    }

    useEffect(() => {
        return () => {
            setSearchInput({ value: "", visible: false })
        }
    }, [])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle} onTouchEnd={() => Keyboard.dismiss()}>
                <Pressable
                    style={styles.pressContainer}
                    onPress={() => {
                        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                        setAppBar(AppBar.MAIN)
                    }}
                >
                    {memos
                        .filter(memo => memo.title.includes(searchInput.value))
                        .map((memo, index) => {
                            const { id, title, type, content, parentId } = memo
                            const selected = selectedMemo.memo.some(selectedMemo => selectedMemo.id === id && selectedMemo.type === type)

                            return (
                                <View key={index} style={[styles.item, { opacity: selected ? 0.5 : 1 }]}>
                                    <Pressable
                                        onLongPress={() => selectMemo(memo)}
                                        onPress={() => {
                                            if (appBar === AppBar.FOLDER_ACTION) {
                                                if (selected) {
                                                    setSelectedMemo(prev => {
                                                        const newMemo = prev.memo.filter(selectedMemo => {
                                                            return !(selectedMemo.id === id && selectedMemo.type === type)
                                                        })
                                                        return { ...prev, memo: newMemo }
                                                    })
                                                    return
                                                }
                                                setSelectedMemo(prev => ({ ...prev, memo: [...prev.memo, memo] }))
                                                return
                                            }
                                            open(id, type, title, content, parentId)
                                        }}
                                    >
                                        {type === MemoType.FILE ? <File /> : filledFolder[id] ? <FilledFolder /> : <EmptyFolder />}
                                    </Pressable>
                                    {focusedInputKey === `${id}-${type}` ? (
                                        <Controller
                                            name={`${id}-${type}` as FieldPath<FormValues>}
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field: { onChange, onBlur, value, ref } }) => (
                                                <TextInput
                                                    ref={ref}
                                                    autoFocus
                                                    value={value ?? title}
                                                    onChangeText={text => {
                                                        const singleLineText = text.replace(/[\r\n]/g, "")
                                                        onChange(singleLineText)
                                                    }}
                                                    onFocus={() => setFocusedInputKey(`${id}-${type}`)}
                                                    focusable={!selected}
                                                    pointerEvents={selected ? "none" : "auto"}
                                                    onBlur={async () => {
                                                        onBlur()
                                                        setFocusedInputKey(null)
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
                                                    style={[styles.title, styles.titleContainer, { color: theme.text, backgroundColor: "rgba(221, 221, 221, 0.47)" }]}
                                                    returnKeyType='done'
                                                    maxLength={30}
                                                    multiline
                                                />
                                            )}
                                        />
                                    ) : (
                                        <Pressable
                                            style={styles.titleContainer}
                                            onPress={() => {
                                                if (appBar === AppBar.FOLDER_ACTION) {
                                                    setSelectedMemo(prev => ({ ...prev, memo: [...prev.memo, memo] }))
                                                    return
                                                }
                                                setFocusedInputKey(`${id}-${type}`)
                                            }}
                                        >
                                            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2} ellipsizeMode='tail'>
                                                {title}
                                            </Text>
                                        </Pressable>
                                    )}
                                </View>
                            )
                        })}
                    {Array.from({ length: Math.max(0, itemsPerRow - (memos.length % itemsPerRow)) }).map((_, index) => {
                        return <View key={index} style={styles.item} />
                    })}
                </Pressable>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        maxHeight: 40,
        borderRadius: 4,
        marginTop: 8,
        padding: 4
    },
    title: {
        textAlign: "center",
        textAlignVertical: "center",
        ...FontStyles.BodySmall
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 0,
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
        flexGrow: 1
    },
    item: {
        width: 76,
        alignItems: "center"
    }
})
