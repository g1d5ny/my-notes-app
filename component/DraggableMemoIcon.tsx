import { hapticPress } from "@/function/haptics"
import { ReactNode, useRef } from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export type Rect = { x: number; y: number; w: number; h: number }
export type RectMap = Record<string, { x: number; y: number; w: number; h: number; isFolder: boolean }>

interface Props {
    rectKey: string
    children: ReactNode
    /** 짧게 탭 */
    onTap: () => void
    /** 롱프레스 후 안 움직이고 떼면 (선택) */
    onSelect: () => void
    /** 롱프레스 후 드래그해서 떼면 (놓은 화면 좌표 전달) */
    onDrop: (dropX: number, dropY: number) => void
    /** 드래그 중 매 프레임 (hover 폴더 판정용) */
    onDragMove: (draggedKey: string, x: number, y: number) => void
    /** 드래그 종료 (hover 초기화) */
    onDragEnd: () => void
    /** 드롭 대상 판정을 위해 자기 화면 위치 등록 */
    registerRect: (key: string, rect: Rect | null) => void
    /** 현재 드래그가 올라가 있는 폴더 key (JS에서 설정, 여기선 애니메이션만 반응) */
    hoveredKey: SharedValue<string | null>
}

const MOVE_THRESHOLD = 8

export const DraggableMemoIcon = ({ rectKey, children, onTap, onSelect, onDrop, onDragMove, onDragEnd, registerRect, hoveredKey }: Props) => {
    const ref = useRef<View>(null)
    const tx = useSharedValue(0)
    const ty = useSharedValue(0)
    const scale = useSharedValue(1)
    const lifted = useSharedValue(0)

    const measure = () => {
        ref.current?.measureInWindow((x, y, w, h) => registerRect(rectKey, { x, y, w, h }))
    }

    const tap = Gesture.Tap()
        .maxDuration(250)
        .onEnd((_e, success) => {
            if (success) runOnJS(onTap)()
        })

    const pan = Gesture.Pan()
        .activateAfterLongPress(250)
        .onStart(() => {
            lifted.value = 1
            scale.value = withSpring(1.12)
            runOnJS(hapticPress)()
        })
        .onUpdate(e => {
            tx.value = e.translationX
            ty.value = e.translationY
            runOnJS(onDragMove)(rectKey, e.absoluteX, e.absoluteY)
        })
        .onEnd(e => {
            const moved = Math.abs(e.translationX) > MOVE_THRESHOLD || Math.abs(e.translationY) > MOVE_THRESHOLD
            if (moved) {
                runOnJS(onDrop)(e.absoluteX, e.absoluteY)
            } else {
                runOnJS(onSelect)()
            }
        })
        // onEnd는 제스처가 취소되면 안 불릴 수 있어, 시각 복귀는 항상 호출되는 onFinalize에서
        .onFinalize(() => {
            runOnJS(onDragEnd)()
            tx.value = withSpring(0)
            ty.value = withSpring(0)
            scale.value = withSpring(1)
            lifted.value = 0
        })

    const gesture = Gesture.Exclusive(pan, tap)

    const animatedStyle = useAnimatedStyle(() => {
        const dragging = lifted.value === 1
        const hovered = !dragging && hoveredKey.value === rectKey
        return {
            transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: dragging ? scale.value : withSpring(hovered ? 1.25 : 1, { damping: 12, stiffness: 280 }) }],
            // 드래그 중인 항목이 대상 폴더보다 위에
            zIndex: dragging ? 200 : hovered ? 50 : 0,
            opacity: dragging ? 0.95 : 1
        }
    })

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View ref={ref} onLayout={measure} style={animatedStyle}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}
