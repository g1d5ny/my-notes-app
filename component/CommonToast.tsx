import { Color, FontStyles } from "@/constant/Style"
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
    return <Toast config={toastConfig} />
}
