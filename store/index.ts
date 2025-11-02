import { QueryClient, QueryKey } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export const invalidateQueries = async (queryKey: QueryKey) => {
    await queryClient.invalidateQueries({ queryKey })
}
