import { useEffect, useMemo, useState } from "react"
import { AlertCircleIcon, CircleAlert } from "lucide-react"
import { Navigate, useLocation } from "react-router-dom"
import {
    ClickUpApiError,
    fetchFirstOpenTaskAssignees,
    normalizeApiKey,
} from "@/clickup"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function App() {
    const location = useLocation()
    const avatarSizeClasses =
        "size-15 sm:size-30 md:size-50 lg:size-60 xl:size-70 2xl:size-80"
    const nameTextClasses =
        "text-2xl font-bold xs:h-[32px] sm:h-[40px] md:h-[60px] lg:h-[72px] xl:h-[96px] 2xl:h-[128px] sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl"
    const subtitleRowClasses =
        " flex items-center justify-start gap-1 sm:gap-1.75 md:gap-2 lg:gap-2.5 xl:gap-2.75 2xl:gap-3"
    const subtitleLogoClasses = "h-4 sm:h-6 md:h-7 lg:h-8 xl:h-9 2xl:h-10"
    const subtitleTextClasses =
        "text-sm font-medium sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl"

    const apiKey = useMemo(() => {
        const keyParam = new URLSearchParams(location.search).get("key")
        if (!keyParam) {
            return null
        }

        const normalizedKey = normalizeApiKey(keyParam)
        return normalizedKey || null
    }, [location.search])

    const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
    const [username, setUsername] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [invalidKey, setInvalidKey] = useState<boolean>(false)

    useEffect(() => {
        async function render() {
            if (!apiKey) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)
            setInvalidKey(false)

            try {
                const assignees = await fetchFirstOpenTaskAssignees(apiKey)

                if (!assignees || assignees.length === 0) {
                    setError("No assignee found for the configured task list")
                    setLoading(false)
                    return
                }

                if (assignees.length > 1) {
                    setError("Cant assign multiple People")
                    setLoading(false)
                    return
                }

                const assignee = assignees[0]
                setAvatarSrc(assignee.profilePicture)
                setUsername(assignee.username.replace(/\s*\(.*?\)/, ""))
                setLoading(false)
            } catch (error) {
                if (
                    error instanceof ClickUpApiError &&
                    (error.status === 401 || error.status === 403)
                ) {
                    setInvalidKey(true)
                    setLoading(false)
                    return
                }

                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Failed to load data"
                setError(errorMessage)
                setLoading(false)
            }
        }

        render()
    }, [apiKey])

    if (!apiKey) {
        return <Navigate to="/auth" replace />
    }

    if (invalidKey) {
        return <Navigate to="/auth?error=invalid_key" replace />
    }

    if (error) {
        return (
            <main className="flex size-full items-center justify-center">
                <Alert variant="destructive" className="flex w-fit max-w-md">
                    <AlertCircleIcon />
                    <AlertTitle>{error ?? "Error"}</AlertTitle>
                </Alert>
            </main>
        )
    }

    return (
        <main className="flex size-full items-center justify-center [&_h1]:font-serif [&_h4]:font-serif [&_p]:font-serif">
            <div className="flex items-center justify-start gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
                {loading ? (
                    <Skeleton
                        className={cn("rounded-full", avatarSizeClasses)}
                    />
                ) : (
                    <>
                        {avatarSrc !== null ? (
                            <img
                                src={avatarSrc}
                                alt={username || "Avatar"}
                                className={cn(
                                    "rounded-full",
                                    avatarSizeClasses
                                )}
                            />
                        ) : (
                            <div
                                className={cn(
                                    "flex items-center justify-center rounded-full bg-foreground",
                                    avatarSizeClasses
                                )}
                            >
                                <p className="text-2xl font-bold tracking-wider text-background sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[160px]">
                                    {username
                                        ?.split(" ")
                                        .map((name) => name[0])
                                        .join("")}
                                </p>
                            </div>
                        )}
                    </>
                )}

                <div className="flex flex-col gap-0.75 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4">
                    {loading ? (
                        <Skeleton
                            className={cn("rounded-2xl", nameTextClasses)}
                        />
                    ) : (
                        <h1 className={nameTextClasses}>{username}</h1>
                    )}

                    {loading ? (
                        <div className={cn(subtitleRowClasses)}>
                            <Skeleton
                                className={cn(
                                    "rounded-md",
                                    subtitleLogoClasses
                                )}
                                style={{ aspectRatio: "2.9 / 1" }}
                            />
                            <h4
                                className={cn(
                                    "animate-pulse rounded-md bg-muted text-transparent",
                                    subtitleTextClasses
                                )}
                            >
                                Tagesverantwortung
                            </h4>
                        </div>
                    ) : (
                        <div className={cn(subtitleRowClasses)}>
                            <img
                                src="./clickup-logo.svg"
                                alt="ClickUp Logo"
                                className={cn(
                                    subtitleLogoClasses,
                                    "ml-0.5 sm:ml-0.75 md:ml-1.25 lg:ml-1.5 xl:ml-1.75 2xl:ml-2 dark:invert"
                                )}
                            />
                            <h4 className={subtitleTextClasses}>
                                Tagesverantwortung
                            </h4>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
