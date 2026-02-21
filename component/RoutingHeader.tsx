import { FontStyles, Styles } from "@/constant/Style"
import { searchInputAtom, themeAtom } from "@/store"
import { MemoType } from "@/type"
import { RelativePathString, router, useGlobalSearchParams } from "expo-router"
import { useAtomValue, useSetAtom } from "jotai"
import { Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native"

type PathStackItem = { id: number; title: string; parentId: number | null }

export default function RoutingHeader() {
    const setSearchInput = useSetAtom(searchInputAtom)
    const theme = useAtomValue(themeAtom)
    const params = useGlobalSearchParams()
    const pathStack = params.pathStack ? (JSON.parse(String(params.pathStack)) as PathStackItem[]) : []

    if (params.type === MemoType.FILE) {
        return <View />
    }

    const goToPath = (index: number) => {
        const stack = pathStack.slice(0, index + 1)
        const pathname = `/folder${stack.map(s => `/${s.title}`).join("")}` as RelativePathString
        const item = stack[index]

        if (item.id === Number(params.id)) {
            return
        }

        router.push({ pathname, params: { type: MemoType.FOLDER, id: item.id, title: item.title, parentId: item.parentId ?? 0, pathStack: JSON.stringify(stack) } })
    }

    return (
        <View
            style={[styles.container, { backgroundColor: theme.background }]}
            onTouchEnd={() => {
                Keyboard.dismiss()
                setSearchInput({ value: "", visible: false })
            }}
        >
            <Text style={[FontStyles.Body, { color: theme.routing }]} numberOfLines={3} ellipsizeMode='middle'>
                현재 경로 :{" "}
            </Text>
            {pathStack.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => goToPath(index)} style={Styles.row}>
                    <Text style={[FontStyles.Body, { color: theme.routing }]}>/</Text>
                    <Text style={[FontStyles.Body, styles.pathItem, { borderColor: theme.routing, color: theme.routing }]}>{item.title}</Text>
                </TouchableOpacity>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    pathItem: {
        borderBottomWidth: 1
    }
})
