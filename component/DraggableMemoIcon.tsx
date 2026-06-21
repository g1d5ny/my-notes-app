import { hapticPress } from "@/function/haptics"
import { ReactNode, useRef } from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { cancelAnimation, runOnJS, SharedValue, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

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
// 원위치 복귀 스프링: 안드로이드에서도 확실히 0으로 수렴하도록 약간 단단하게.
const SPRING_BACK = { damping: 18, stiffness: 260, mass: 0.6 }

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
            // 직전 복귀 스프링이 아직 돌고 있으면 취소하고 깨끗한 0에서 시작.
            cancelAnimation(tx)
            cancelAnimation(ty)
            cancelAnimation(scale)
            tx.value = 0
            ty.value = 0
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
            // 드롭/선택 "판정"만 onEnd에서. 위치 복귀는 onFinalize 한 곳에서만 처리한다.
            const moved = Math.abs(e.translationX) > MOVE_THRESHOLD || Math.abs(e.translationY) > MOVE_THRESHOLD
            if (moved) {
                runOnJS(onDrop)(e.absoluteX, e.absoluteY)
            } else {
                runOnJS(onSelect)()
            }
        })
        // onEnd는 안드로이드에서 제스처 취소 시 호출되지 않을 수 있어, 항상 불리는 onFinalize에서
        // 단일하게 원위치 복귀시킨다. (onEnd/onFinalize 양쪽 리셋 시 같은 프레임 경쟁으로 안드로이드에서 멈춤)
        .onFinalize(() => {
            // 비동기 mutation과 무관하게, 놓는 즉시 UI 복귀를 확정한다.
            cancelAnimation(tx)
            cancelAnimation(ty)
            cancelAnimation(scale)
            lifted.value = 0
            tx.value = withSpring(0, SPRING_BACK)
            ty.value = withSpring(0, SPRING_BACK)
            scale.value = withSpring(1, SPRING_BACK)
            runOnJS(onDragEnd)()
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
