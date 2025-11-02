// component/MemoList.tsx
import { File, Folder } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { ThemeContext } from "@/context/ThemeContext"
import { Memo, MemoType } from "@/type"
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router"
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
    const params = useLocalSearchParams()
    const pathname = usePathname()
    const { theme } = useContext(ThemeContext)
    const folderId = params.path as RelativePathString
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

    const saveTitle = async (id: number, title: string) => {
        await db.runAsync(`UPDATE ${MemoType.FILE} SET title = ? WHERE id = ?`, [title, id])
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainerStyle} showsVerticalScrollIndicator={false}>
                {memos.map(({ id, title, type }, index) => {
                    return (
                        <View key={index} style={styles.item}>
                            <Pressable style={{ borderWidth: 1, borderColor: "blue" }} onPress={() => open(id, type, title)}>
                                {type === MemoType.FILE ? <File /> : <Folder />}
                            </Pressable>
                            <Pressable style={{ width: "100%", marginTop: 8, padding: 4, borderWidth: 1, borderColor: "red" }} onPress={() => open(id, type, title)}>
                                <Controller
                                    name={`title-${id}` as FieldPath<FormValues>}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            ref={titleRef}
                                            onBlur={async () => {
                                                onBlur()
                                                const currentValue = value || title
                                                if (currentValue && currentValue !== title) {
                                                    await saveTitle(id, currentValue)
                                                }
                                            }}
                                            onChangeText={onChange}
                                            value={value || title}
                                            onSubmitEditing={() => titleRef.current?.focus()}
                                            style={[styles.title, { color: theme.text }]}
                                        />
                                    )}
                                />
                                {/* <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
                                    {title}
                                </Text> */}
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
    title: {
        ...FontStyles.BodySmall,
        textAlign: "center"
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
