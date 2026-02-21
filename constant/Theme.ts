import { ThemeColorPalette } from "@/type"
import { Color } from "./Style"

export const LightTheme: ThemeColorPalette = {
    background: Color.background.light,
    border: Color.border.light,
    text: Color.text.light,
    gray: Color.gray,
    icon: Color.black
}

export const DarkTheme: ThemeColorPalette = {
    background: Color.background.dark,
    border: Color.border.dark,
    text: Color.text.dark,
    gray: Color.gray,
    icon: Color.white
}

const themeKeys: (keyof ThemeColorPalette)[] = ["background", "border", "text", "gray", "icon"]

export const isSameTheme = (a: ThemeColorPalette, b: ThemeColorPalette): boolean => themeKeys.every(key => a[key] === b[key])
