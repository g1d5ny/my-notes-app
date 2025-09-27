import { Color } from "./Style"

export const LightTheme = {
    background: Color.background.light,
    border: Color.border.light,
    text: Color.text.light,
    gray: {
        1: Color.gray[1],
        2: Color.gray[2]
    },
    icon: Color.black
}

export const DarkTheme = {
    background: Color.background.dark,
    border: Color.border.dark,
    text: Color.text.dark,
    gray: {
        1: Color.gray[1],
        2: Color.gray[2]
    },
    icon: Color.white
}
