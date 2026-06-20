import Svg, { Path } from "react-native-svg"

interface IconProps {
    color: string
    size?: number
}

/** + (메인 FAB) — 회전하면 × 가 되도록 정중앙 대칭 */
export const PlusIcon = ({ color, size = 30 }: IconProps) => (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
        <Path d='M12 5V19' stroke={color} strokeWidth={2.4} strokeLinecap='round' />
        <Path d='M5 12H19' stroke={color} strokeWidth={2.4} strokeLinecap='round' />
    </Svg>
)

/** 파일(메모) 추가 — 접힌 모서리 + 본문 라인 + 작은 플러스 느낌의 문서 */
export const NoteAddIcon = ({ color, size = 26 }: IconProps) => (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
        <Path d='M7 3.75H13L18.25 9V18.25C18.25 19.355 17.355 20.25 16.25 20.25H7.75C6.645 20.25 5.75 19.355 5.75 18.25V5.75C5.75 4.645 6.645 3.75 7.75 3.75H7Z' stroke={color} strokeWidth={1.8} strokeLinejoin='round' />
        <Path d='M13 3.75V9H18.25' stroke={color} strokeWidth={1.8} strokeLinejoin='round' />
        <Path d='M8.75 13H13.5M8.75 16H11.25' stroke={color} strokeWidth={1.8} strokeLinecap='round' />
    </Svg>
)

/** 선택 체크 — 선택된 항목 배지용 */
export const CheckIcon = ({ color, size = 14 }: IconProps) => (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
        <Path d='M5 12.5L10 17.5L19 7' stroke={color} strokeWidth={2.8} strokeLinecap='round' strokeLinejoin='round' />
    </Svg>
)

/** 폴더 추가 — 탭 달린 폴더 + 중앙 플러스 */
export const FolderAddIcon = ({ color, size = 26 }: IconProps) => (
    <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
        <Path d='M3.75 7.5C3.75 6.395 4.645 5.5 5.75 5.5H9.2C9.73 5.5 10.24 5.71 10.61 6.09L11.79 7.27C11.98 7.46 12.23 7.56 12.5 7.56H18.25C19.355 7.56 20.25 8.455 20.25 9.56V16.5C20.25 17.605 19.355 18.5 18.25 18.5H5.75C4.645 18.5 3.75 17.605 3.75 16.5V7.5Z' stroke={color} strokeWidth={1.8} strokeLinejoin='round' />
        <Path d='M12 11V15.5M9.75 13.25H14.25' stroke={color} strokeWidth={1.8} strokeLinecap='round' />
    </Svg>
)
