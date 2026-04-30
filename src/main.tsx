import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { createRoot } from "react-dom/client"
import { StrictMode } from "react"
import { Auth } from "@/Auth.tsx"
import { App } from "@/App.tsx"
import "@/index.css"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider defaultTheme="system">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
)
