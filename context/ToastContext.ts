import { createContext } from "react"

export const ToastContext = createContext<{ message: string; setMessage: (message: string) => void }>({ message: "toast message", setMessage: () => {} })
