import { createContext, Dispatch, SetStateAction } from "react"
import { ColorSchemeName } from "react-native"
import { LightTheme } from "../constant/Theme"
import { ThemeColorPalette } from "../type"

export const ThemeContext = createContext<{
    theme: ThemeColorPalette
    setTheme: Dispatch<SetStateAction<ThemeColorPalette>>
    currentScheme: ColorSchemeName
    setCurrentScheme: Dispatch<SetStateAction<ColorSchemeName>>
}>({ theme: LightTheme, setTheme: () => {}, currentScheme: "light", setCurrentScheme: () => {} })
