import { FilePlus, FolderPlus } from "@/assets/icons/svg/icon"
import { FontStyles, Styles } from "@/constant/Style"
import { DarkTheme, LightTheme } from "@/constant/Theme"
import { ThemeContext } from "@/context/ThemeContext"
import { router } from "expo-router"
import React, { useContext, useState } from "react"
import { Image, Pressable, StyleSheet, Text } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CustomModal } from "./CustomModal"

const MARGIN = 16
const ICON_SIZE = 80

export const AddMemo = () => {
    const { theme } = useContext(ThemeContext)

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
                    <Image source={require("@/assets/icons/icon_plus.png")} style={styles.icon} />
                </Pressable>
            )}
            <CustomModal visible={modalVisible} setVisible={setModalVisible}>
                <Pressable style={[Styles.row, styles.plus, { bottom: bottom + MARGIN + ICON_SIZE * 2 }]} onPress={handleAddFile}>
                    <Text style={styles.text}>파일</Text>
                    <FilePlus theme={theme === LightTheme ? DarkTheme : LightTheme} />
                </Pressable>
                <Pressable style={[Styles.row, styles.plus, { bottom: bottom + MARGIN + ICON_SIZE }]} onPress={handleAddFolder}>
                    <Text style={styles.text}>폴더</Text>
                    <FolderPlus theme={theme === LightTheme ? DarkTheme : LightTheme} />
                </Pressable>
                <Pressable style={[styles.plus, { bottom: bottom + MARGIN }]} onPress={closeModal}>
                    <Image source={require("@/assets/icons/icon_plus.png")} style={styles.icon} />
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
