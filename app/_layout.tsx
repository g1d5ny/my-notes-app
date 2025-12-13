import { customFontsToLoad } from "@/constant/Style"
import { store } from "@/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as Font from "expo-font"
import { Slot } from "expo-router"
import { Provider } from "jotai"
import { GestureHandlerRootView } from "react-native-gesture-handler"

Font.loadAsync(customFontsToLoad)
const queryClient = new QueryClient()

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Provider store={store}>
                    <Slot />
                </Provider>
            </GestureHandlerRootView>
        </QueryClientProvider>
    )
}
