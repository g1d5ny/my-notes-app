import { CheckIcon } from "@/assets/icons/svg/addMenu"
import EmptyFolder from "@/assets/icons/svg/icon_empty_folder.svg"
import File from "@/assets/icons/svg/icon_file.svg"
import FilledFolder from "@/assets/icons/svg/icon_filled_folder.svg"
import { DraggableMemoIcon, Rect, RectMap } from "@/component/DraggableMemoIcon"
import { FontStyles } from "@/constant/Style"
import { hapticPress, hapticSuccess, hapticTap, hapticWarning } from "@/function/haptics"
import { useCheckFilledMemo } from "@/hook/useCheckFilledMemo"
import { useSearchedMemo } from "@/hook/useSearchedMemo"
import { useUpdateMemo } from "@/hook/useUpdateMemo"
import { appBarAtom, searchInputAtom, selectedMemoAtom, themeAtom } from "@/store"
import { AppBar, Memo, MemoType, SelectedMemoType } from "@/type"
import { RelativePathString, router, useLocalSearchParams, usePathname } from "expo-router"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { useEffect, useMemo, useRef, useState } from "react"
import { Controller, FieldPath, useForm } from "react-hook-form"
import { Dimensions, Keyboard, Platform, Pressable, StyleSheet, TextInput, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { useSharedValue } from "react-native-reanimated"
import Toast from "react-native-toast-message"

type FormValues = {
    title: string
}

const ITEM_WIDTH = 76
const PADDING = 16

const getItemsPerRow = () => {
    const screenWidth = Dimensions.get("window").width
    const padding = PADDING * 2 // 좌우 패딩 16 * 2
    const availableWidth = screenWidth - padding
    const itemWidth = ITEM_WIDTH // 아이템 너비 + gap
    return Math.floor(availableWidth / itemWidth)
}

export const FolderList = ({ memos }: { memos: Memo[] }) => {
    const theme = useAtomValue(themeAtom)
    const params = useLocalSearchParams()
    const currentPath = usePathname()
    const [appBar, setAppBar] = useAtom(appBarAtom)
    const [selectedMemo, setSelectedMemo] = useAtom(selectedMemoAtom)
    const setSearchInput = useSetAtom(searchInputAtom)
    const { updateFolderTitle, updateFileTitle, moveMemo } = useUpdateMemo()
    // 드롭/hover 판정의 정본 Map(ref) — 동시 등록 race 없음.
    const itemRects = useRef<Map<string, RectMap[string]>>(new Map())
    // 각 아이템의 측정용 노드 — 드래그 시작 시 직접 다시 측정해 좌표 staleness를 없앤다.
    const itemNodes = useRef<Map<string, View>>(new Map())
    const hoveredRef = useRef<string | null>(null)
    // 제목 입력창 ref 맵 — 탭 시 프로그램적으로 focus()해서 키보드를 확실히 띄운다.
    const inputRefs = useRef<Map<string, TextInput>>(new Map())
    // 폴더 확대 애니메이션이 반응할 현재 hover key (JS에서 설정)
    const hoveredKey = useSharedValue<string | null>(null)
    const { data: filledFolder = [] } = useCheckFilledMemo(memos)
    const [focusedInputKey, setFocusedInputKey] = useState<string | null>(null)
    const { control } = useForm<FormValues>({ defaultValues: { title: "" } })
    const { data: searchedMemos = [] } = useSearchedMemo()
    const itemsPerRow = useMemo(() => getItemsPerRow(), [])

    const open = (id: number, type: MemoType, title: string, content: string | undefined, parentId: number | null) => {
        hapticTap()
        const path = (currentPath + `/${title}`) as RelativePathString
        const pathStack = params.pathStack ? JSON.parse(String(params.pathStack)) : []
        const nextPathStack = [...pathStack, { id, title, parentId }]
        router.push({
            pathname: path,
            params: { type, id, title, content, parentId, pathStack: JSON.stringify(nextPathStack) }
        })
    }

    const selectMemo = (memo: Memo) => {
        hapticPress()
        setSelectedMemo(prev => (prev.memo.some(s => s.id === memo.id && s.type === memo.type) ? prev : { ...prev, memo: [...prev.memo, memo] }))
        setAppBar(AppBar.FOLDER_ACTION)
    }

    // 드래그 대상 위치 등록
    const registerRect = (key: string, rect: Rect | null) => {
        if (rect) itemRects.current.set(key, { ...rect, isFolder: key.endsWith(MemoType.FOLDER) })
        else itemRects.current.delete(key)
    }

    // 드래그 시작 시 모든 아이템 좌표를 직접 다시 측정 — onLayout 시점의 어긋난 좌표를 갱신.
    const remeasureAll = () => {
        itemNodes.current.forEach((node, key) => node.measureInWindow((x, y, w, h) => registerRect(key, { x, y, w, h })))
    }

    // 드래그 중: 손가락 밑 폴더 찾아 hover 표시(+햅틱). 바뀔 때만 갱신.
    const onDragMove = (draggedKey: string, x: number, y: number) => {
        let found: string | null = null
        for (const [k, r] of itemRects.current) {
            if (k === draggedKey || !r.isFolder) continue
            if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) {
                found = k
                break
            }
        }
        if (found !== hoveredRef.current) {
            hoveredRef.current = found
            hoveredKey.value = found
            if (found) hapticTap()
        }
    }

    const onDragEnd = () => {
        hoveredRef.current = null
        hoveredKey.value = null
    }

    // 짧게 탭: 열기 / 붙여넣기·선택 모드에선 토글
    const handleTap = (memo: Memo, selected: boolean) => {
        const { id, type, title, content, parentId } = memo
        if (appBar === AppBar.PASTE && selected) return
        if (appBar === AppBar.FOLDER_ACTION) {
            if (selected) {
                setSelectedMemo(prev => ({ ...prev, memo: prev.memo.filter(s => !(s.id === id && s.type === type)) }))
                return
            }
            setSelectedMemo(prev => ({ ...prev, memo: [...prev.memo, memo] }))
            return
        }
        open(id, type, title, content, parentId)
    }

    // 드래그 후 폴더 위에 떨어뜨리면 그 폴더로 이동
    const handleDrop = (dragged: Memo, dropX: number, dropY: number) => {
        const list = searchedMemos.length > 0 ? searchedMemos : memos
        const target = list.find(m => {
            if (m.type !== MemoType.FOLDER) return false
            if (m.id === dragged.id && m.type === dragged.type) return false
            const r = itemRects.current.get(`${m.id}-${m.type}`)
            return !!r && dropX >= r.x && dropX <= r.x + r.w && dropY >= r.y && dropY <= r.y + r.h
        })
        if (!target) return
        moveMemo({ memoId: dragged.id, type: dragged.type, fromParentId: dragged.parentId ?? null, toParentId: target.id })
            .then(() => {
                hapticSuccess()
                const name = target.title.replace(/\s+/g, " ").trim()
                Toast.show({ text1: `'${name}'(으)로 이동했어요.`, type: "customToast", position: "bottom", visibilityTime: 2000 })
            })
            .catch(() => {
                hapticWarning()
                Toast.show({ text1: "여기로 옮길 수 없어요.", type: "customToast", position: "bottom", visibilityTime: 2000 })
            })
    }

    useEffect(() => {
        return () => {
            setSearchInput({ value: "", visible: false })
        }
    }, [])

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainerStyle}>
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => {
                        Keyboard.dismiss()
                        setSearchInput({ value: "", visible: false })
                        setSelectedMemo({ memo: [], type: SelectedMemoType.COPY })
                        setAppBar(AppBar.MAIN)
                    }}
                />
                <View style={styles.pressContainer} pointerEvents='box-none'>
                    {(searchedMemos.length > 0 ? searchedMemos : memos).map((memo, index) => {
                        const { id, title, type, content, parentId } = memo
                        const selected = selectedMemo.memo.some(selectedMemo => selectedMemo.id === id && selectedMemo.type === type)
                        const editing = focusedInputKey === `${id}-${type}`

                        return (
                            <View key={`${type}:${id}`} style={styles.item}>
                                <DraggableMemoIcon
                                    rectKey={`${id}-${type}`}
                                    registerRect={registerRect}
                                    registerNode={node => (node ? itemNodes.current.set(`${id}-${type}`, node) : itemNodes.current.delete(`${id}-${type}`))}
                                    hoveredKey={hoveredKey}
                                    onDragStart={remeasureAll}
                                    onDragMove={onDragMove}
                                    onDragEnd={onDragEnd}
                                    onTap={() => handleTap(memo, selected)}
                                    onSelect={() => selectMemo(memo)}
                                    onDrop={(x, y) => handleDrop(memo, x, y)}
                                >
                                    <View style={styles.iconWrap}>
                                        <View style={[styles.iconBg, selected && { backgroundColor: theme.accentSoft }]}>{type === MemoType.FILE ? <File /> : filledFolder[id] ? <FilledFolder /> : <EmptyFolder />}</View>
                                        {selected && (
                                            <View style={[styles.badge, { backgroundColor: theme.accent, borderColor: theme.background }]}>
                                                <CheckIcon color={theme.onAccent} size={13} />
                                            </View>
                                        )}
                                    </View>
                                </DraggableMemoIcon>
                                <View style={[styles.titleContainer, editing && { backgroundColor: theme.surfaceVariant }]}>
                                    <Controller
                                        name={`${id}-${type}` as FieldPath<FormValues>}
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field: { onChange, onBlur, value, ref } }) => {
                                            const inSelection = appBar === AppBar.FOLDER_ACTION
                                            return (
                                                <TextInput
                                                    // iOS TextInput은 color prop 변경을 라이브로 재적용 안 함 → 테마 바뀌면 remount해 글자색 갱신.
                                                    key={theme.text}
                                                    ref={node => {
                                                        ref(node)
                                                        if (node) inputRefs.current.set(`${id}-${type}`, node)
                                                        else inputRefs.current.delete(`${id}-${type}`)
                                                    }}
                                                    value={value ?? title}
                                                    editable={!inSelection}
                                                    onChangeText={onChange}
                                                    onFocus={() => setFocusedInputKey(`${id}-${type}`)}
                                                    onBlur={() => {
                                                        onBlur()
                                                        setFocusedInputKey(null)
                                                        const currentValue = value
                                                        if (currentValue && currentValue !== title) {
                                                            if (type === MemoType.FILE) {
                                                                updateFileTitle({ title: currentValue, memoId: id, parentId: parentId ?? 0 })
                                                            } else {
                                                                updateFolderTitle({ title: currentValue, memoId: id, parentId: parentId ?? 0 })
                                                            }
                                                        } else {
                                                            onChange(title)
                                                        }
                                                    }}
                                                    style={[styles.title, { color: theme.text }]}
                                                    // numberOfLines는 Android에서 1줄 내용도 그 줄 수만큼 높이를 예약해 아래 여백을 만든다.
                                                    numberOfLines={2}
                                                    // 편집이 끝나면 커서를 맨 앞으로 → 줄바꿈 있는 제목도 첫 줄부터 보인다.
                                                    selection={editing ? undefined : { start: 0, end: 0 }}
                                                    // 편집 중엔 2줄 박스 안에서 스크롤 허용(iOS). 표시 중엔 스크롤 없이 잘림.
                                                    scrollEnabled={editing}
                                                    underlineColorAndroid='transparent'
                                                    returnKeyType='done'
                                                    maxLength={30}
                                                    multiline
                                                />
                                            )
                                        }}
                                    />
                                    {/* 편집 중이 아닐 때만 탭 레이어를 올린다. 바깥 Pressable이 탭을 가로채도
                                        여기서 직접 focus()를 호출해 키보드를 확실히 띄운다(또는 선택 모드면 선택).
                                        편집이 시작되면(focusedInputKey 설정) 레이어가 사라져 커서 이동·타이핑은 네이티브로. */}
                                    {focusedInputKey !== `${id}-${type}` && (
                                        <Pressable
                                            style={StyleSheet.absoluteFill}
                                            onPress={() => {
                                                if (appBar === AppBar.FOLDER_ACTION) {
                                                    setSelectedMemo(prev => (prev.memo.some(s => s.id === id && s.type === type) ? prev : { ...prev, memo: [...prev.memo, memo] }))
                                                    return
                                                }
                                                inputRefs.current.get(`${id}-${type}`)?.focus()
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        )
                    })}
                    {Array.from({ length: Math.max(0, itemsPerRow - (memos.length % itemsPerRow)) }).map((_, index) => {
                        return <View key={`filler-${index}`} style={styles.item} />
                    })}
                </View>
            </KeyboardAwareScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        borderRadius: 4,
        padding: 4,
        maxHeight: 50,
        overflow: "hidden"
    },
    title: {
        width: "100%",
        textAlign: "center",
        textAlignVertical: "center",
        lineHeight: Platform.OS === "android" ? 20 : undefined,
        ...FontStyles.BodySmall
    },
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 0,
        gap: 12
    },
    pressContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: 16,
        flexGrow: 1
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingTop: 18
    },
    item: {
        width: 76,
        alignItems: "center"
    },
    iconWrap: {
        // 배지가 모서리 밖으로 나오므로 여기선 클리핑하지 않는다.
        alignItems: "center",
        justifyContent: "center"
    },
    iconBg: {
        borderRadius: 16,
        // Android(Fabric)에서 borderRadius가 배경에 안 먹는 경우가 있어 overflow로 강제 클리핑.
        overflow: "hidden",
        padding: 4
    },
    badge: {
        position: "absolute",
        top: -2,
        right: -2,
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2
    }
})
