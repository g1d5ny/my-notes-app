import { DarkTheme, LightTheme } from "@/constant/Theme"
import { Modal, SortType, ThemeColorPalette } from "@/type"
import { atom, createStore } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import { Appearance, ColorSchemeName } from "react-native"
import { createMMKV } from "react-native-mmkv"

export const store = createStore()

export const storage = createMMKV()

const sortStorage = createJSONStorage<SortType>(() => ({
    getItem: key => {
        return storage.getString(key) ?? null
    },
    setItem: (key, value) => {
        return storage.set(key, value)
    },
    removeItem: key => {
        return storage.remove(key)
    }
}))

export const sortAtom = atomWithStorage<SortType>("sortType", SortType.CREATED_AT, sortStorage)

// const themeStorage = createJSONStorage<ThemeColorPalette>(() => ({
//     getItem: key => {
//         return storage.getString(key) ?? null
//     },
//     setItem: (key, value) => {
//         return storage.set(key, value)
//     },
//     removeItem: key => {
//         return storage.remove(key)
//     }
// }))

// export const themeAtom = atomWithStorage<ThemeColorPalette>("theme", Appearance.getColorScheme() === "dark" ? DarkTheme : LightTheme, themeStorage)
export const themeAtom = atom<ThemeColorPalette>(Appearance.getColorScheme() === "dark" ? DarkTheme : LightTheme)

export const schemeAtom = atom<ColorSchemeName>(Appearance.getColorScheme())

export const modalAtom = atom<Modal>({ visible: false, message: "", onConfirm: () => {}, confirmText: "" })
// TODO: 추후 보정 필요
export const infoModalVisibleAtom = atom<boolean>(false)
