import { createContext, Dispatch, SetStateAction } from "react"

export enum SortType {
    CREATED_AT = "createdAt",
    UPDATED_AT = "updatedAt",
    TITLE = "title"
}
export const SortContext = createContext<{ sort: SortType; setSort: Dispatch<SetStateAction<SortType>> }>({ sort: SortType.CREATED_AT, setSort: () => {} })
