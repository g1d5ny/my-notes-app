import { sortAtom } from "@/store"
import { MemoType, SortType } from "@/type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useSetAtom } from "jotai"

export const useSort = () => {
    const queryClient = useQueryClient()
    const setSort = useSetAtom(sortAtom)

    const { mutate: sortCreatedAt } = useMutation({
        mutationFn: async () => {
            // atom 업데이트
            setSort(SortType.CREATED_AT)
            // 모든 관련 쿼리 invalidate하여 UI 업데이트
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER] })
        }
    })

    const { mutate: sortUpdatedAt } = useMutation({
        mutationFn: async () => {
            // atom 업데이트
            setSort(SortType.UPDATED_AT)
            // 모든 관련 쿼리 invalidate하여 UI 업데이트
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER] })
        }
    })

    const { mutate: sortTitle } = useMutation({
        mutationFn: async () => {
            // atom 업데이트
            setSort(SortType.TITLE)
            // 모든 관련 쿼리 invalidate하여 UI 업데이트
            await queryClient.invalidateQueries({ queryKey: [MemoType.FOLDER] })
        }
    })

    return { sortCreatedAt, sortUpdatedAt, sortTitle }
}
