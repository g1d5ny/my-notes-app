import { useEffect } from "react"
import Toast, { BaseToast, BaseToastProps } from "react-native-toast-message"

const toastConfig = {
    customToast: (props: BaseToastProps) => (
        <BaseToast
            style={{
                backgroundColor: "white",
                borderRadius: 20,
                height: 40,
                borderLeftWidth: 0,
                shadowOpacity: 0,
                justifyContent: "center"
            }}
            contentContainerStyle={{
                paddingHorizontal: 16,
                alignItems: "center",
                height: 40
            }}
            text1Style={{
                color: "black",
                fontSize: 14,
                fontWeight: "500"
            }}
            text1={props.text1}
            onPress={props.onPress}
        />
    )
}

export const CommonToast = () => {
    useEffect(() => {
        Toast.show({
            text1: "Hello",
            type: "customToast"
        })
    }, [])
    return <Toast config={toastConfig} />
}
