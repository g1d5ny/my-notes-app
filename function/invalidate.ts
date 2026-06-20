import { MemoType } from "@/type"
import { QueryClient } from "@tanstack/react-query"

/**
 * 메모 관련 쿼리 무효화를 한 곳에서 표준화.
 * 영향받은 폴더 목록 + 폴더 채움여부(checkFilledMemo) 아이콘을 갱신한다.
 * parentIds: 변경이 일어난 폴더들(생성/삭제=1개, 이동=출발·도착 2개). null은 루트(0).
 */
export const invalidateMemoQueries = async (queryClient: QueryClient, parentIds: (number | null)[]) => {
    const unique = Array.from(new Set(parentIds.map(id => id ?? 0)))
    await Promise.all([...unique.map(id => queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER, id] })), queryClient.invalidateQueries({ queryKey: ["checkFilledMemo"] })])
}

/** 전체 초기화 등, 모든 메모 쿼리를 무효화 */
export const invalidateAllMemoQueries = async (queryClient: QueryClient) => {
    await Promise.all([queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER] }), queryClient.invalidateQueries({ queryKey: [MemoType.FILE] }), queryClient.invalidateQueries({ queryKey: ["checkFilledMemo"] })])
}
