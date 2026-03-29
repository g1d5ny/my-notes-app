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

    const goToPath = (index: number) => {
        const item = pathStack[index]

        if (item.id === Number(params.id)) {
            return
        }

        const stepsBack = pathStack.length - 1 - index
        router.dismiss(stepsBack)
    }

    if (params.type === MemoType.FILE) {
        return <View />
    }

    return (
        <View
            style={[styles.container, { backgroundColor: theme.background }]}
            onTouchEnd={() => {
                Keyboard.dismiss()
                setSearchInput({ value: "", visible: false })
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    if (!params.id && !params.type && !params.pathStack) return
                    router.dismissAll()
                    router.replace({ pathname: "/folder" as RelativePathString })
                }}
                style={Styles.row}
            >
                <Text style={[FontStyles.Body, styles.pathItem, { borderColor: theme.routing, color: theme.routing }]} numberOfLines={3} ellipsizeMode='middle'>
                    현재 경로
                </Text>
                <Text style={[FontStyles.Body, { color: theme.routing }]} numberOfLines={3} ellipsizeMode='middle'>
                    {" "}
                    :{" "}
                </Text>
            </TouchableOpacity>
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
