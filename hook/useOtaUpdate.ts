import { modalAtom } from "@/store"
import * as Updates from "expo-updates"
import { useSetAtom } from "jotai"
import { useEffect } from "react"

/**
 * 앱 시작 시 OTA(EAS Update) 업데이트가 있는지 확인하고, 있으면 작은 모달로 물어본다.
 * 확인을 누르면 새 번들을 받아 즉시 재시작한다.
 *
 * - 개발 모드/Expo Go에선 Updates가 비활성(isEnabled=false)이라 아무 것도 안 한다.
 * - 네트워크 오류 등은 조용히 무시(앱 진입을 막지 않음).
 */
export const useOtaUpdate = () => {
    const setModal = useSetAtom(modalAtom)

    useEffect(() => {
        // 릴리즈 빌드에서만 동작. 개발 클라이언트/Expo Go에선 스킵.
        if (__DEV__ || !Updates.isEnabled) return

        let cancelled = false

        const checkForUpdate = async () => {
            try {
                const result = await Updates.checkForUpdateAsync()
                if (cancelled || !result.isAvailable) return

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
                // 업데이트 확인 실패는 무시 — 앱 사용을 막지 않는다.
            }
        }

        checkForUpdate()

        return () => {
            cancelled = true
        }
    }, [])
}
