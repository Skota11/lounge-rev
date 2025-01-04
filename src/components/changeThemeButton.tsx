import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { FaRegMoon, FaRegSun } from "react-icons/fa"

export default function Main() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState<boolean>(false)
    useEffect(() => setMounted(true), [])
    return (
        <>
            <button
                aria-label="DarkModeToggle"
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="fixed z-50 bottom-10 right-10 p-4
  border-4 rounded-full cursor-pointer"
            >
                {mounted && <>{theme === 'dark' ? <FaRegMoon /> : <FaRegSun />}</>}
            </button>
        </>
    )
}