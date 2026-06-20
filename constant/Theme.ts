import { ThemeColorPalette } from "@/type"
import { Color } from "./Style"

export const LightTheme: ThemeColorPalette = {
    background: Color.background.light,
    surface: Color.surface.light,
    surfaceVariant: Color.surfaceVariant.light,
    border: Color.border.light,
    text: Color.text.light,
    textSecondary: Color.textSecondary.light,
    gray: Color.textSecondary.light,
    icon: Color.text.light,
    routing: Color.routing.light,
    accent: Color.accent.light,
    onAccent: Color.onAccent.light,
    accentSoft: Color.accentSoft.light
}

export const DarkTheme: ThemeColorPalette = {
    background: Color.background.dark,
    surface: Color.surface.dark,
    surfaceVariant: Color.surfaceVariant.dark,
    border: Color.border.dark,
    text: Color.text.dark,
    textSecondary: Color.textSecondary.dark,
    gray: Color.textSecondary.dark,
    icon: Color.text.dark,
    routing: Color.routing.dark,
    accent: Color.accent.dark,
    onAccent: Color.onAccent.dark,
    accentSoft: Color.accentSoft.dark
}
