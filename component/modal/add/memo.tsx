import { FolderAddIcon, NoteAddIcon, PlusIcon } from "@/assets/icons/svg/addMenu"
import { Elevation, FontStyles, Radius, Spacing } from "@/constant/Style"
import { hapticTap } from "@/function/haptics"
import { useCreateMemo } from "@/hook/useCreateMemo"
import { selectedMemoAtom, themeAtom } from "@/store"
import { MemoType, ThemeColorPalette } from "@/type"
import { useGlobalSearchParams } from "expo-router"
import { useAtomValue } from "jotai"
import { ReactNode, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"
import Animated, { interpolate, SharedValue, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const MARGIN = 16
const FAB = 56
const GAP = 14

interface ActionItemProps {
    progress: SharedValue<number>
    open: boolean
    label: string
    icon: ReactNode
    onPress: () => void
    bottomOffset: number
    theme: ThemeColorPalette
}

const ActionItem = ({ progress, open, label, icon, onPress, bottomOffset, theme }: ActionItemProps) => {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: progress.value,
        transform: [{ translateY: interpolate(progress.value, [0, 1], [12, 0]) }]
    }))

    return (
        <Animated.View pointerEvents={open ? "auto" : "none"} style={[styles.actionRow, { bottom: bottomOffset }, animatedStyle]}>
            <Pressable style={styles.actionInner} onPress={onPress}>
                <View style={[styles.chip, Elevation.low, { backgroundColor: theme.surface }]}>
                    <Text style={[FontStyles.ButtonText2, { color: theme.text }]}>{label}</Text>
                </View>
                <View style={[styles.circle, Elevation.medium, { backgroundColor: theme.accent }]}>{icon}</View>
            </Pressable>
        </Animated.View>
    )
}

interface AddMemoProps {
    onAddFile: () => void
}

export const AddMemo = ({ onAddFile }: AddMemoProps) => {
    const { bottom } = useSafeAreaInsets()
    const theme = useAtomValue(themeAtom)
    const selectedMemo = useAtomValue(selectedMemoAtom)
    const { createFolder } = useCreateMemo()
    const params = useGlobalSearchParams()
    const [open, setOpen] = useState(false)
    const progress = useSharedValue(0)
    const parentId = params.id ? Number(params.id) : null
    const currentType = params.type

    const visible = currentType !== MemoType.FILE && selectedMemo.memo.length === 0

    const animate = (next: boolean) => {
        setOpen(next)
        progress.value = withTiming(next ? 1 : 0, { duration: 200 })
    }

    const toggle = () => {
        hapticTap()
        animate(!open)
    }

    const close = () => animate(false)

    const handleAddFile = () => {
        hapticTap()
        close()
        onAddFile()
    }

    const handleAddFolder = () => {
        hapticTap()
        close()
        createFolder({ parentId })
    }

    const fabIconStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${interpolate(progress.value, [0, 1], [0, 45])}deg` }]
    }))

    const backdropStyle = useAnimatedStyle(() => ({
        opacity: interpolate(progress.value, [0, 1], [0, 0.45])
    }))

    if (!visible) return null

    const base = bottom + MARGIN

    return (
        <>
            {/* 딤 배경 — 빈 곳 누르면 닫힘 */}
            <Animated.View pointerEvents={open ? "auto" : "none"} style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            <ActionItem progress={progress} open={open} label='파일' icon={<NoteAddIcon color={theme.onAccent} />} onPress={handleAddFile} bottomOffset={base + (FAB + GAP) * 2} theme={theme} />
            <ActionItem progress={progress} open={open} label='폴더' icon={<FolderAddIcon color={theme.onAccent} />} onPress={handleAddFolder} bottomOffset={base + (FAB + GAP)} theme={theme} />

            {/* FAB — 제자리에서 +↔X 회전 */}
            <Pressable style={[styles.fab, Elevation.high, { bottom: base, backgroundColor: theme.accent }]} onPress={toggle}>
                <Animated.View style={fabIconStyle}>
                    <PlusIcon color={theme.onAccent} size={30} />
                </Animated.View>
            </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        backgroundColor: "#000000"
    },
    fab: {
        position: "absolute",
        right: MARGIN,
        width: FAB,
        height: FAB,
        borderRadius: Radius.full,
        alignItems: "center",
        justifyContent: "center"
    },
    actionRow: {
        position: "absolute",
        right: MARGIN,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    actionInner: {
        flexDirection: "row",
        alignItems: "center",
        gap: Spacing.md
    },
    chip: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.full
    },
    circle: {
        width: FAB,
        height: FAB,
        borderRadius: Radius.full,
        alignItems: "center",
        justifyContent: "center"
    }
})
