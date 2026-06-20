import { FontStyles, Spacing } from "@/constant/Style"
import { hapticTap } from "@/function/haptics"
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

        hapticTap()
        const stepsBack = pathStack.length - 1 - index
        router.dismiss(stepsBack)
    }

    const goRoot = () => {
        if (!params.id && !params.type && !params.pathStack) return
        hapticTap()
        router.dismissAll()
        router.replace({ pathname: "/folder" as RelativePathString })
    }

    if (params.type === MemoType.FILE) {
        return <View />
    }

    const lastIndex = pathStack.length - 1

    return (
        <View
            style={styles.container}
            onTouchEnd={() => {
                Keyboard.dismiss()
                setSearchInput({ value: "", visible: false })
            }}
        >
            <TouchableOpacity onPress={goRoot} hitSlop={6}>
                <Text style={[FontStyles.BodySmall, styles.crumb, { color: pathStack.length === 0 ? theme.text : theme.routing }]}>현재 경로</Text>
            </TouchableOpacity>
            {pathStack.map((item, index) => {
                const isCurrent = index === lastIndex
                return (
                    <View key={index} style={styles.segment}>
                        <Text style={[FontStyles.BodySmall, styles.separator, { color: theme.textSecondary }]}>›</Text>
                        <TouchableOpacity onPress={() => goToPath(index)} hitSlop={6}>
                            <Text style={[isCurrent ? FontStyles.ButtonText2 : FontStyles.BodySmall, styles.crumb, { color: isCurrent ? theme.text : theme.routing }]} numberOfLines={1} ellipsizeMode='middle'>
                                {item.title}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap"
    },
    segment: {
        flexDirection: "row",
        alignItems: "center"
    },
    crumb: {
        maxWidth: 140
    },
    separator: {
        marginHorizontal: Spacing.sm
    }
})
