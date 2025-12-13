// component/MemoList.tsx
import { EmptyFolder, File, FilledFolder } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { useCheckFilledMemo } from "@/hook/useCheckFilledMemo"
import { useEditMemo } from "@/hook/useEditMemo"
import { Memo, MemoType } from "@/type"
import { useQueryClient } from "@tanstack/react-query"
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router"
import { useContext, useMemo, useRef } from "react"
import { Controller, FieldPath, useForm } from "react-hook-form"
import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native"

type FormValues = {
    title: string
}

const ITEM_WIDTH = 76
const PADDING = 16
export const FolderList = () => {
    const { theme } = useContext(ThemeContext)
    const queryClient = useQueryClient()
    const params = useLocalSearchParams()
    const { saveTitle } = useEditMemo()
    const titleRef = useRef<TextInput>(null)
    const currentId = params.id ? Number(params?.id) : 0
    const parentId = params.parentId ? Number(params?.parentId) : null
    const memos = queryClient.getQueryData<Memo[]>([MemoType.FOLDER, currentId]) ?? []
    const { data: filledFolder = [] } = useCheckFilledMemo(memos)

    const { control } = useForm<FormValues>({
        defaultValues: { title: "" }
    })

    const getItemsPerRow = () => {
        const screenWidth = Dimensions.get("window").width
        const padding = PADDING * 2 // 좌우 패딩 16 * 2
        const availableWidth = screenWidth - padding
        const itemWidth = ITEM_WIDTH + PADDING // 아이템 너비 + gap
        return Math.floor(availableWidth / itemWidth)
    }

    const itemsPerRow = useMemo(() => getItemsPerRow(), [])

    const currentPath = usePathname()

    const open = (id: number, type: MemoType, title: string) => {
        const path = (currentPath + `/${title}`) as RelativePathString
        router.push({ pathname: path, params: { type, id, title } })
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                {memos.map(({ id, title, type }, index) => {
                    return (
                        <View key={index} style={styles.item}>
                            <Pressable style={{ borderWidth: 1, borderColor: "blue" }} onPress={() => open(id, type, title)}>
                                {type === MemoType.FILE ? <File /> : filledFolder[id] ? <FilledFolder /> : <EmptyFolder />}
                            </Pressable>
                            <Pressable style={styles.titleContainer} onPress={() => open(id, type, title)}>
                                <Controller
                                    name={`title-${index}` as FieldPath<FormValues>}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            ref={titleRef}
                                            onBlur={async () => {
                                                onBlur()
                                                const currentValue = value
                                                if (currentValue && currentValue !== title) {
                                                    saveTitle({ title: currentValue, memoId: id, parentId })
                                                } else {
                                                    onChange(title)
                                                }
                                            }}
                                            onChangeText={onChange}
                                            value={value ?? title}
                                            // numberOfLines={2}
                                            // multiline
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
        marginTop: 8,
        borderWidth: 1,
        borderColor: "red"
    },
    title: {
        ...FontStyles.BodySmall,
        textAlign: "center",
        includeFontPadding: false,
        padding: 0
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
