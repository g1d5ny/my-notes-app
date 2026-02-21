import { Memo } from "@/type"
import { UseQueryResult } from "@tanstack/react-query"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import { Platform } from "react-native"
import Toast from "react-native-toast-message"
import { useReadMemo } from "./useReadMemo"

/** 파일명으로 쓸 수 없거나 비어 있을 때를 위한 정리 */
const sanitizeFileName = (title: string): string => {
    const firstLine = title.split("\n")[0].trim()
    const safe = firstLine.replace(/[/\\:*?"<>|]/g, "_").trim()
    return safe || "메모"
}

export const useShareMemo = () => {
    const { data: memo } = useReadMemo() as UseQueryResult<Memo, Error>

    const exportFile = async () => {
        try {
            const fileName = sanitizeFileName(memo?.title ?? "")
            const fileUri = FileSystem.cacheDirectory + `${fileName}.txt`
            const title = memo?.title?.split("\n")[0]?.trim() ?? ""
            const content = memo?.content ?? ""
            const fileContent = `${title}\n\n${content}`
            await FileSystem.writeAsStringAsync(fileUri, fileContent)
            await Sharing.shareAsync(fileUri, {
                ...(Platform.OS === "android" && {
                    mimeType: "application/octet-stream",
                    dialogTitle: "텍스트 파일로 공유"
                }),
                ...(Platform.OS === "ios" && { UTI: "public.plain-text" })
            })
        } catch (error) {
            console.error("파일 내보내기 실패:", error)
            Toast.show({
                text1: "파일 내보내기 실패했습니다.",
                type: "customToast",
                position: "bottom",
                visibilityTime: 3000
            })
        }
    }

    return { exportFile }
}
