import { StyleSheet } from "react-native"

export const Styles = StyleSheet.create({
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

export const FontStyles = {
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
        lineHeight: 20,
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
    }
}

export const Color = {
    white: "#fff",
    black: "#000",
    cancel: "#c9c9c9",
    gray: "#6B6B6B",
    yellow: {
        1: "#6B6B6B",
        2: "#FCD53F"
    }
}
