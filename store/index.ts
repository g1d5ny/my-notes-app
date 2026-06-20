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

// 테마는 scheme에서 파생 — 항상 최신 팔레트 정의를 반영하고, LightTheme/DarkTheme 참조 동일성도 보장된다.
export const themeAtom = atom<ThemeColorPalette>(get => (get(schemeAtom) === "dark" ? DarkTheme : LightTheme))

export const modalAtom = atom<Modal>({ visible: false, message: "", onConfirm: () => {}, confirmText: "" })

export const appBarAtom = atom<AppBar>(AppBar.MAIN)

export const selectedMemoAtom = atom<SelectedMemo>({ memo: [], type: SelectedMemoType.COPY })

// TODO: 추후 보정 필요
export const infoModalVisibleAtom = atom<boolean>(false)

export const searchInputAtom = atom<SearchInput>({ value: "", visible: false })

export const editModeAtom = atom<EditMode>({ id: 0, isEditMode: false })
