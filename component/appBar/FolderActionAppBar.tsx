import { Close } from "@/assets/icons/svg/icon"
import { FontStyles } from "@/constant/Style"
import { appBarAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, SelectedMemoType } from "@/type"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { Pressable, StyleSheet, Text, View } from "react-native"

export const FolderActionAppBar = () => {
    const theme = useAtomValue(themeAtom)
    const setAppBar = useSetAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const count = selectedMemo.memo.length

    return (
        <View style={styles.row}>
            <Pressable
                hitSlop={10}
                onPress={() => {
                    setAppBar(AppBar.MAIN)
                    setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                }}
            >
                <Close theme={theme} />
            </Pressable>
            <Text style={[FontStyles.SubTitle, { color: theme.text }]}>{count > 0 ? `${count}개 선택` : "선택"}</Text>
            <View style={styles.spacer} />
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
    spacer: {
        width: 24
    }
})
