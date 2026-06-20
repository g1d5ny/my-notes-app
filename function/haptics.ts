import * as Haptics from "expo-haptics"
import { Platform } from "react-native"

// 햅틱은 iOS/Android 실기기에서만 의미가 있다. 웹/시뮬레이터에서 던지는 예외를 조용히 무시한다.
const safe = (fn: () => Promise<void>) => {
    if (Platform.OS === "web") return
    fn().catch(() => {})
}

// 가벼운 탭/토글 (항목 열기, 선택 토글 등)
export const hapticTap = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light))

// 좀 더 또렷한 피드백 (롱프레스로 선택 진입 등)
export const hapticPress = () => safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium))

// 성공 알림 (저장 완료 등)
export const hapticSuccess = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success))

// 경고/에러 (검증 실패, 삭제 확인 등)
export const hapticWarning = () => safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning))
