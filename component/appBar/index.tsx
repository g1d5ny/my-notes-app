import { MemoType } from "@/type"
import { useGlobalSearchParams } from "expo-router"
import { AppBarParent } from "./AppBarParent"
import { FileDetailAppBar } from "./FileDetailAppBar"
import { MainAppBar } from "./MainAppBar"

export const AppBar = () => {
    const params = useGlobalSearchParams()

    return <AppBarParent>{params.type === MemoType.FILE ? <FileDetailAppBar /> : <MainAppBar />}</AppBarParent>
}
