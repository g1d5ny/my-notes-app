import { FontStyles, Styles } from "@/constant/Style"
import { router } from "expo-router"
import React, { useState } from "react"
import { ColorSchemeName, Image, Pressable, StyleSheet, Text, useColorScheme } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CustomModal } from "./CustomModal"

const MARGIN = 16
const ICON_SIZE = 80

const plusIconMap: Record<NonNullable<ColorSchemeName>, number> = {
    light: require("@/assets/icons/light/icon_plus.png"),
    dark: require("@/assets/icons/dark/icon_plus.png")
}

const filePlusIconMap: Record<NonNullable<ColorSchemeName>, number> = {
    light: require("@/assets/icons/light/icon_file_plus.png"),
    dark: require("@/assets/icons/dark/icon_file_plus.png")
}

const folderPlusIconMap: Record<NonNullable<ColorSchemeName>, number> = {
    light: require("@/assets/icons/light/icon_folder_plus.png"),
    dark: require("@/assets/icons/dark/icon_folder_plus.png")
}

export const AddMemo = () => {
    const scheme = useColorScheme()
    const plusIcon = plusIconMap[scheme || "light"]
    const filePlus = filePlusIconMap[scheme || "light"]
    const folderPlus = folderPlusIconMap[scheme || "light"]

    const [modalVisible, setModalVisible] = useState(false)
    const { bottom } = useSafeAreaInsets()

    const closeModal = () => {
        setModalVisible(false)
    }

    const openModal = () => {
        setModalVisible(true)
    }

    const handleAddFile = () => {
        closeModal()
        router.push("/add/AddFile")
    }

    const handleAddFolder = () => {
        closeModal()
    }

    return (
        <>
            {!modalVisible && (
                <Pressable style={[styles.plus, { bottom: bottom + MARGIN }]} onPress={openModal}>
                    <Image source={plusIcon} style={styles.icon} />
                </Pressable>
            )}
            <CustomModal visible={modalVisible} setVisible={setModalVisible}>
                <Pressable style={[Styles.row, styles.plus, { bottom: bottom + MARGIN + ICON_SIZE * 2 }]} onPress={handleAddFile}>
                    <Text style={styles.text}>파일</Text>
                    <Image source={filePlus} style={styles.icon} />
                </Pressable>
                <Pressable style={[Styles.row, styles.plus, { bottom: bottom + MARGIN + ICON_SIZE }]} onPress={handleAddFolder}>
                    <Text style={styles.text}>폴더</Text>
                    <Image source={folderPlus} style={styles.icon} />
                </Pressable>
                <Pressable style={[styles.plus, { bottom: bottom + MARGIN }]} onPress={closeModal}>
                    <Image source={plusIcon} style={[styles.icon, { transform: [{ rotate: "45deg" }] }]} />
                </Pressable>
            </CustomModal>
        </>
    )
}

const styles = StyleSheet.create({
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE
    },
    text: {
        ...FontStyles.SubTitle,
        color: "#CFD0D4"
    },
    plus: {
        position: "absolute",
        right: MARGIN,
        zIndex: 20
    }
})
