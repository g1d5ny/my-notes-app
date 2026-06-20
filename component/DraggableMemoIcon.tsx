import { ReactNode, useRef } from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"

export type Rect = { x: number; y: number; w: number; h: number }

interface Props {
    rectKey: string
    children: ReactNode
    /** 짧게 탭 */
    onTap: () => void
    /** 롱프레스 후 안 움직이고 떼면 (선택) */
    onSelect: () => void
    /** 롱프레스 후 드래그해서 떼면 (놓은 화면 좌표 전달) */
    onDrop: (dropX: number, dropY: number) => void
    /** 드롭 대상 판정을 위해 자기 화면 위치 등록 */
    registerRect: (key: string, rect: Rect | null) => void
}

const MOVE_THRESHOLD = 8

export const DraggableMemoIcon = ({ rectKey, children, onTap, onSelect, onDrop, registerRect }: Props) => {
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
        })
        .onUpdate(e => {
            tx.value = e.translationX
            ty.value = e.translationY
        })
        .onEnd(e => {
            const moved = Math.abs(e.translationX) > MOVE_THRESHOLD || Math.abs(e.translationY) > MOVE_THRESHOLD
            if (moved) {
                runOnJS(onDrop)(e.absoluteX, e.absoluteY)
            } else {
                runOnJS(onSelect)()
            }
            tx.value = withSpring(0)
            ty.value = withSpring(0)
            scale.value = withSpring(1)
            lifted.value = 0
        })

    const gesture = Gesture.Exclusive(pan, tap)

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
        zIndex: lifted.value ? 100 : 0,
        opacity: lifted.value ? 0.95 : 1
    }))

    return (
        <GestureDetector gesture={gesture}>
            <Animated.View ref={ref} onLayout={measure} style={animatedStyle}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}
