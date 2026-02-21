import { DarkTheme, LightTheme } from "@/constant/Theme"
import { AppBar, Modal, SearchInput, SelectedMemo, SelectedMemoType, SortType, ThemeColorPalette } from "@/type"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { atom, createStore } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import { Appearance, ColorSchemeName } from "react-native"

export const store = createStore()

const sortStorage = createJSONStorage<SortType>(() => AsyncStorage)

export const sortAtom = atomWithStorage<SortType>("sortType", SortType.CREATED_AT, sortStorage)

const themeStorage = createJSONStorage<ThemeColorPalette>(() => AsyncStorage)

export const themeAtom = atomWithStorage<ThemeColorPalette>("theme", Appearance.getColorScheme() === "dark" ? DarkTheme : LightTheme, themeStorage)

const schemeStorage = createJSONStorage<ColorSchemeName>(() => AsyncStorage)

export const schemeAtom = atomWithStorage<ColorSchemeName>("scheme", Appearance.getColorScheme() === "dark" ? "dark" : "light", schemeStorage)

export const modalAtom = atom<Modal>({ visible: false, message: "", onConfirm: () => {}, confirmText: "" })

export const appBarAtom = atom<AppBar>(AppBar.MAIN)

export const selectedMemoAtom = atom<SelectedMemo>({ memo: [], type: SelectedMemoType.COPY })

// TODO: 추후 보정 필요
export const infoModalVisibleAtom = atom<boolean>(false)

export const searchInputAtom = atom<SearchInput>({ value: "", visible: false })
