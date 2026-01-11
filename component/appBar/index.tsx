import { appBarAtom } from "@/store"
import { AppBar as AppBarType } from "@/type"
import { useAtomValue } from "jotai"
import { AppBarParent } from "./AppBarParent"
import { FileDetailAppBar } from "./FileDetailAppBar"
import { FolderActionAppBar } from "./FolderActionAppBar"
import { MainAppBar } from "./MainAppBar"
import { PasteAppBar } from "./PasteAppBar"

const AppBarComponent = {
    [AppBarType.MAIN]: <MainAppBar />,
    [AppBarType.FILE]: <FileDetailAppBar />,
    [AppBarType.FOLDER_ACTION]: <FolderActionAppBar />,
    [AppBarType.PASTE]: <PasteAppBar />
}

export const AppBar = () => {
    const appBar = useAtomValue(appBarAtom)

    return <AppBarParent>{AppBarComponent[appBar]}</AppBarParent>
}
