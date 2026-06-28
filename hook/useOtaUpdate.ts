import { modalAtom } from "@/store"
import * as Updates from "expo-updates"
import { useSetAtom } from "jotai"
import { useEffect, useRef } from "react"
import { AppState } from "react-native"

/**
 * 앱이 백그라운드 → 포그라운드로 올라올 때마다 OTA(EAS Update)를 확인하고,
 * 새 번들이 있으면 작은 모달로 물어본다. 확인을 누르면 받아서 즉시 재시작한다.
 *
 * - 개발 모드/Expo Go에선 Updates가 비활성(isEnabled=false)이라 아무 것도 안 한다.
 * - 네트워크 오류 등은 조용히 무시(앱 사용을 막지 않음).
 * - 최상단에서 한 번 호출 → 앱 생애주기 내내 마운트되므로 언마운트 경쟁은 없고,
 *   cleanup은 AppState 리스너 해제만 하면 된다.
 */
export const useOtaUpdate = () => {
    const setModal = useSetAtom(modalAtom)
    const appState = useRef(AppState.currentState)

    useEffect(() => {
        // 릴리즈 빌드에서만 동작. 개발 클라이언트/Expo Go에선 스킵.
        if (__DEV__ || !Updates.isEnabled) return

        const checkForUpdate = async () => {
            try {
                const result = await Updates.checkForUpdateAsync()
                if (!result.isAvailable) return

                setModal({
                    visible: true,
                    message: "새로운 업데이트가 있어요.\n지금 업데이트할까요?",
                    confirmText: "업데이트",
                    onConfirm: async () => {
                        // 새 번들을 받고 즉시 재시작해 적용. reloadAsync가 앱을 다시 띄우므로
                        // 이후 코드는 실행되지 않는다.
                        await Updates.fetchUpdateAsync()
                        await Updates.reloadAsync()
                    }
                })
            } catch {
                // 업데이트 확인 실패는 무시.
            }
        }

        const subscription = AppState.addEventListener("change", next => {
            // 백그라운드/inactive에서 다시 활성(포그라운드)으로 올라올 때만 체크.
            if (appState.current.match(/inactive|background/) && next === "active") {
                checkForUpdate()
            }
            appState.current = next
        })

        return () => subscription.remove()
    }, [])
}
