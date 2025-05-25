import { createContext, Dispatch, SetStateAction } from "react"
import { LightTheme } from "../constant/Theme"
import { ThemeColorPalette } from "../type"

export const ThemeContext = createContext<{
    theme: ThemeColorPalette
    setTheme: Dispatch<SetStateAction<ThemeColorPalette>>
}>({ theme: LightTheme, setTheme: () => {} })
