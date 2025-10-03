export interface ThemeColorPalette {
    background: string
    border: string
    text: string
    // gray: {
    //     1: string
    //     2: string
    // }
    gray: string
    icon: string
}

export interface Memo {
    id: number
    type: string
    title: string
    content: string
    parentId: string
    path: string
    createdAt: number
    updatedAt: number
}
