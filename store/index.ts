import { DarkTheme, LightTheme } from "@/constant/Theme"
import { AppBar, EditMode, Modal, SearchInput, SelectedMemo, SelectedMemoType, SortType, ThemeColorPalette } from "@/type"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { atom, createStore } from "jotai"
import { atomWithStorage, createJSONStorage } from "jotai/utils"
import { Appearance, ColorSchemeName } from "react-native"

export const store = createStore()

const sortStorage = createJSONStorage<SortType>(() => AsyncStorage)

export const sortAtom = atomWithStorage<SortType>("sortType", SortType.CREATED_AT, sortStorage)

const schemeStorage = createJSONStorage<ColorSchemeName>(() => AsyncStorage)

export const schemeAtom = atomWithStorage<ColorSchemeName>("scheme", Appearance.getColorScheme() === "dark" ? "dark" : "light", schemeStorage)

// 테마는 직접 저장(persist)한다. scheme에서 파생하면 비동기 hydration 후
// 일부 소비자에 갱신 통지가 누락돼 재시작 시 테마가 어긋나는 버그가 있었다.
const themeStorage = createJSONStorage<ThemeColorPalette>(() => AsyncStorage)

export const themeAtom = atomWithStorage<ThemeColorPalette>("theme", Appearance.getColorScheme() === "dark" ? DarkTheme : LightTheme, themeStorage)

export const modalAtom = atom<Modal>({ visible: false, message: "", onConfirm: () => {}, confirmText: "" })

export const appBarAtom = atom<AppBar>(AppBar.MAIN)

export const selectedMemoAtom = atom<SelectedMemo>({ memo: [], type: SelectedMemoType.COPY })

// TODO: 추후 보정 필요
export const infoModalVisibleAtom = atom<boolean>(false)

export const searchInputAtom = atom<SearchInput>({ value: "", visible: false })

export const editModeAtom = atom<EditMode>({ id: 0, isEditMode: false })
