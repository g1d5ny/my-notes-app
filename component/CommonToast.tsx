import { Color, FontStyles } from "@/constant/Style"
import { ToastContext } from "@/context/ToastContext"
import { useContext, useEffect } from "react"
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message"

const toastConfig = {
    customToast: (props: BaseToastProps) => (
        <BaseToast
            style={{
                height: 44,
                borderRadius: 24,
                backgroundColor: Color.yellow[2]
            }}
            contentContainerStyle={{
                height: 44,
                paddingHorizontal: 12
            }}
            text1Style={FontStyles.Body}
            text1={props.text1}
        />
    )
}

export const CommonToast = () => {
    const { message, setMessage } = useContext(ToastContext)

    useEffect(() => {
        setMessage("toast!")

        Toast.show({
            text1: message,
            type: "customToast",
            position: "bottom",
            visibilityTime: 5000
        })
    }, [])
    return <Toast config={toastConfig} />
}
