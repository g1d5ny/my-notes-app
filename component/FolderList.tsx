// component/MemoList.tsx
import { EmptyFolder, File, FilledFolder } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { invalidateQueries } from "@/store"
import { Memo, MemoType } from "@/type"
import { useQuery } from "@tanstack/react-query"
import { RelativePathString, router, usePathname } from "expo-router"
import { useSQLiteContext } from "expo-sqlite"
import { useContext, useMemo, useRef } from "react"
import { Controller, FieldPath, useForm } from "react-hook-form"
import { Dimensions, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native"

type FormValues = {
    title: string
}

const ITEM_WIDTH = 76
const PADDING = 16
export const FolderList = ({ memos }: { memos: Memo[] }) => {
    const db = useSQLiteContext()
    const { theme } = useContext(ThemeContext)
    const titleRef = useRef<TextInput>(null)

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

    const saveTitle = async (id: number, title: string, type: MemoType) => {
        await db.runAsync(`UPDATE ${type} SET title = ? WHERE id = ?`, [title, id])
        await invalidateQueries([MemoType.FOLDER, MemoType.FILE])
    }

    // 각 폴더 아이템마다 내용이 있는지 체크
    const checkFolderHasContent = async (folderId: number) => {
        const result = await db.getFirstAsync<{ totalCount: number }>(
            `SELECT 
                (SELECT COUNT(*) FROM folder WHERE parentId = ?) + 
                (SELECT COUNT(*) FROM file WHERE parentId = ?) as totalCount`,
            [folderId, folderId]
        )
        return (result?.totalCount ?? 0) > 0
    }

    // 각 폴더 아이템마다 내용이 있는지 체크
    const folderIds = useMemo(() => memos.filter(m => m.type === MemoType.FOLDER).map(m => m.id), [memos])

    const { data: folderContentMap = {} } = useQuery({
        queryKey: [folderIds],
        queryFn: async () => {
            const map: Record<number, boolean> = {}
            await Promise.all(
                folderIds.map(async id => {
                    map[id] = await checkFolderHasContent(id)
                })
            )
            return map
        },
        enabled: folderIds.length > 0
    })

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                {memos.map(({ id, title, type }, index) => {
                    return (
                        <View key={index} style={styles.item}>
                            <Pressable style={{ borderWidth: 1, borderColor: "blue" }} onPress={() => open(id, type, title)}>
                                {type === MemoType.FILE ? <File /> : folderContentMap[id] ? <FilledFolder /> : <EmptyFolder />}
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
                                                const currentValue = value ?? title
                                                if (currentValue && currentValue !== title) {
                                                    await saveTitle(id, currentValue, type)
                                                } else {
                                                    onChange(title)
                                                }
                                            }}
                                            onChangeText={onChange}
                                            value={value ?? title}
                                            numberOfLines={2}
                                            multiline
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
