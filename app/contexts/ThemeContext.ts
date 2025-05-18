import { createContext, Dispatch, SetStateAction } from "react"
import { LightTheme } from "../constants/Theme"
import { ThemeColorPalette } from "../types"

export const ThemeContext = createContext<{
    theme: ThemeColorPalette
    setTheme: Dispatch<SetStateAction<ThemeColorPalette>>
}>({ theme: LightTheme, setTheme: () => {} })
