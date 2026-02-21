import { useEffect } from "react"
import { BackHandler, Platform } from "react-native"

/**
 * Android 하드웨어 백 버튼을 훅으로 처리.
 * handler가 true를 반환하면 이벤트를 소비하고, false면 기본 동작(앱 종료 등)으로 넘긴다.
 */
export const useBackHandler = (handler: () => boolean) => {
    useEffect(() => {
        if (Platform.OS !== "android") return

        const subscription = BackHandler.addEventListener("hardwareBackPress", handler)
        return () => subscription.remove()
    }, [handler])
}
