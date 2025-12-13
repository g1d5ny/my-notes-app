import { DarkTheme, LightTheme } from "@/constant/Theme"
import { Modal, SortType, ThemeColorPalette } from "@/type"
import { atom, createStore } from "jotai"
import { Appearance, ColorSchemeName } from "react-native"

export const store = createStore()

export const sortAtom = atom<SortType>(SortType.CREATED_AT)

export const themeAtom = atom<ThemeColorPalette>(Appearance.getColorScheme() === "dark" ? DarkTheme : LightTheme)

export const schemeAtom = atom<ColorSchemeName>(Appearance.getColorScheme())

export const modalAtom = atom<Modal>({ visible: false, message: "", onConfirm: () => {}, confirmText: "" })
