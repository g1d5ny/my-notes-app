import { StyleSheet } from "react-native"

export const Styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: "row",
        alignItems: "center"
    }
})

export const customFontsToLoad = {
    The_Jamsil_Bold: require("@/assets/fonts/The_Jamsil_Bold.otf"),
    The_Jamsil_Medium: require("@/assets/fonts/The_Jamsil_Medium.otf"),
    The_Jamsil_Regular: require("@/assets/fonts/The_Jamsil_Regular.otf")
}

export const FontFamilies = {
    bold: "The_Jamsil_Bold",
    medium: "The_Jamsil_Medium",
    regular: "The_Jamsil_Regular"
}

export const FontStyles = StyleSheet.create({
    Display: {
        fontSize: 32,
        lineHeight: 40,
        fontFamily: FontFamilies.bold,
        letterSpacing: -0.5,
        fontWeight: "700"
    },
    Title: {
        fontSize: 24,
        lineHeight: 32,
        fontFamily: FontFamilies.medium,
        letterSpacing: -0.25,
        fontWeight: "600"
    },
    Content: {
        fontSize: 18,
        lineHeight: 24,
        fontFamily: FontFamilies.regular,
        letterSpacing: 0,
        fontWeight: "400"
    },
    SubTitle: {
        fontSize: 20,
        lineHeight: 28,
        fontFamily: FontFamilies.medium,
        letterSpacing: -0.2,
        fontWeight: "500"
    },
    Body: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: FontFamilies.regular,
        letterSpacing: 0,
        fontWeight: "400"
    },
    BodySmall: {
        fontSize: 14,
        // lineHeight: 20,
        fontFamily: FontFamilies.regular,
        letterSpacing: 0.1,
        fontWeight: "400"
    },
    Caption: {
        fontSize: 12,
        lineHeight: 14,
        fontFamily: FontFamilies.regular,
        letterSpacing: 0.2,
        fontWeight: "400"
    },
    ButtonText1: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: FontFamilies.bold,
        letterSpacing: 0.1,
        fontWeight: "600"
    },
    ButtonText2: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: FontFamilies.medium,
        letterSpacing: 0.1,
        fontWeight: "600"
    }
})

export const Color = {
    white: "#FFFFFF",
    black: "#000000",
    cancel: "#c9c9c9",
    gray: "#6B6B6B",
    yellow: {
        1: "#FFB02E",
        2: "#FCD53F"
    },
    // 브랜드 액센트 (FAB·선택·활성 상태 등 포인트). 폴더 아이콘 노랑(#F6C05A)에 맞춤, 라이트·다크 동일.
    accent: {
        light: "#F6C05A",
        dark: "#F6C05A"
    },
    // 액센트 위에 올라가는 텍스트/아이콘 색
    onAccent: {
        light: "#1C1C1E",
        dark: "#1C1C1E"
    },
    // 액센트의 옅은 톤 (선택 배경·하이라이트)
    accentSoft: {
        light: "#FFF4E0",
        dark: "rgba(255, 197, 61, 0.18)"
    },
    background: {
        // 살짝 톤 다운된 베이스 (그 위 surface가 떠 보이게)
        light: "#F2F2F7",
        dark: "#1C1C1E"
    },
    // 카드·입력 영역 등 배경 위에 올라가는 면
    surface: {
        light: "#FFFFFF",
        dark: "#2C2C2E"
    },
    // 눌림·구분 등 한 단계 약한 면
    surfaceVariant: {
        light: "#E9E9EE",
        dark: "#3A3A3C"
    },
    border: {
        light: "#E5E5EA",
        dark: "#38383A"
    },
    text: {
        light: "#1C1C1E",
        dark: "#F2F2F7"
    },
    // 보조 텍스트 (날짜·메타·placeholder 등)
    textSecondary: {
        light: "#8E8E93",
        dark: "#98989F"
    },
    routing: {
        light: "rgba(60, 60, 67, 0.6)",
        dark: "rgba(235, 235, 245, 0.6)"
    }
}

// 디자인 토큰 — 일관된 모서리·여백·그림자를 위해 전 화면 공유
export const Radius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999
}

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32
}

export const Elevation = StyleSheet.create({
    low: {
        shadowColor: "#000000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },
    medium: {
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4
    },
    high: {
        shadowColor: "#000000",
        shadowOpacity: 0.16,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8
    }
})
