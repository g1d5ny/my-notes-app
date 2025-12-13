// component/MemoList.tsx
import { EmptyFolder, File, FilledFolder } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { useCheckFilledMemo } from "@/hook/useCheckFilledMemo"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { sortAtom, themeAtom } from "@/store"
import { Memo, MemoType } from "@/type"
import { useQueryClient } from "@tanstack/react-query"
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router"
import { useAtomValue } from "jotai"
import { useMemo, useRef } from "react"
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
    const { updateFolderTitle, updateFileTitle } = useUpdateMemo()
    const titleRef = useRef<TextInput>(null)
    const currentId = params.id ? Number(params?.id) : 0
    const memos = queryClient.getQueryData<Memo[]>([MemoType.FOLDER, currentId, sortType]) ?? []
    const { data: filledFolder = [] } = useCheckFilledMemo(memos)

    const { control } = useForm<FormValues>({
        defaultValues: { title: "" }
    })

    const itemsPerRow = useMemo(() => getItemsPerRow(), [])

    const open = (id: number, type: MemoType, title: string, parentId: number | null) => {
        const path = (currentPath + `/${title}`) as RelativePathString
        router.push({ pathname: path, params: { type, id, title, parentId } })
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                {memos.map(({ id, title, type, parentId }, index) => {
                    return (
                        <View key={index} style={styles.item}>
                            <Pressable onPress={() => open(id, type, title, parentId)}>{type === MemoType.FILE ? <File /> : filledFolder[id] ? <FilledFolder /> : <EmptyFolder />}</Pressable>
                            <Pressable style={styles.titleContainer} onPress={() => open(id, type, title, parentId)}>
                                <Controller
                                    name={`${id}-${type}` as FieldPath<FormValues>}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            ref={titleRef}
                                            onBlur={async () => {
                                                onBlur()
                                                const currentValue = value
                                                if (currentValue && currentValue !== title) {
                                                    if (type === MemoType.FILE) {
                                                        updateFileTitle({ title: currentValue, memoId: id, parentId })
                                                    } else {
                                                        updateFolderTitle({ title: currentValue, memoId: id, parentId })
                                                    }
                                                } else {
                                                    onChange(title)
                                                }
                                            }}
                                            onChangeText={onChange}
                                            value={value ?? title}
                                            onSubmitEditing={() => titleRef.current?.blur()}
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
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: "100%",
        maxHeight: 40,
        marginTop: 8
    },
    title: {
        width: "100%",
        borderRadius: 4,
        backgroundColor: "rgba(221, 221, 221, 0.2)",
        textAlign: "center",
        textAlignVertical: "center",
        ...FontStyles.BodySmall
    },
    container: {
        flex: 1,
        padding: 16,
        gap: 12
    },
    contentContainerStyle: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: 16
    },
    item: {
        width: 76,
        alignItems: "center"
    }
})
