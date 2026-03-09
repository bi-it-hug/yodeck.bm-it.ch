import { useEffect, useMemo, useState } from 'react'
import APIResource from './APIResource'
import { CircleAlert } from 'lucide-react'
import { Navigate, useLocation } from 'react-router-dom'

type FetchResult = {
    status: number
    data: unknown | null
}

export default function App() {
    const location = useLocation()
    const avatarSizeClasses =
        'size-15 sm:size-30 md:size-50 lg:size-60 xl:size-70 2xl:size-80'
    const nameTextClasses =
        'text-2xl font-bold sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl'
    const subtitleRowClasses =
        ' flex items-center justify-start gap-1 sm:gap-1.75 md:gap-2 lg:gap-2.5 xl:gap-2.75 2xl:gap-3'
    const subtitleLogoClasses = 'h-4 sm:h-6 md:h-7 lg:h-8 xl:h-9 2xl:h-10'
    const subtitleTextClasses =
        'text-sm font-medium sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'

    const apiKey = useMemo(
        () => {
            const key = new URLSearchParams(location.search).get('key')?.trim()
            return key ? key.replaceAll(' ', '+') : null
        },
        [location.search],
    )

    const resources = useMemo(
        () => ({
            assigneeTaskList: new APIResource('901202079960', 'task-list'),
        }),
        [],
    )

    const [avatarSrc, setAvatarSrc] = useState<string | null>()
    const [username, setUsername] = useState<string>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [invalidKey, setInvalidKey] = useState<boolean>(false)

    useEffect(() => {
        async function get(URL: string): Promise<FetchResult | null> {
            try {
                const headers: HeadersInit = {
                    accept: 'application/json',
                }

                if (apiKey) headers['Authorization'] = apiKey

                const response = await fetch(URL, {
                    method: 'GET',
                    headers,
                })

                if (!response.ok) {
                    console.error(response)
                    return { status: response.status, data: null }
                }
                return { status: response.status, data: await response.json() }
            } catch (error) {
                console.error(`Error: Failed to fetch data: ${error}`)
                return null
            }
        }

        async function render(resource: APIResource) {
            if (!apiKey) {
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)
            setInvalidKey(false)

            try {
                const result = await get(resource.URL)

                if (!result) {
                    setError('Failed to load data')
                    setLoading(false)
                    return
                }

                if (result.status === 401 || result.status === 403) {
                    setInvalidKey(true)
                    setLoading(false)
                    return
                }

                const data = result.data as
                    | {
                          tasks?: Array<{
                              assignees?: Array<{
                                  profilePicture: string | null
                                  username: string
                              }>
                          }>
                      }
                    | null

                const assignees = data?.tasks?.[0]?.assignees

                if (!assignees || assignees.length === 0) {
                    setError('No assignee found for the configured task list')
                    setLoading(false)
                    return
                }

                if (assignees.length > 1) {
                    setError('Cant assign multiple People')
                    setLoading(false)
                    return
                }

                const assignee = assignees[0]

                if (assignee.profilePicture === null) {
                    setAvatarSrc(null)
                } else {
                    setAvatarSrc(assignee.profilePicture)
                }
                setUsername(assignee.username.replace(/\s*\(.*?\)/, ''))
                setLoading(false)
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Failed to load data'
                setError(errorMessage)
                setLoading(false)
                console.error(`Error: Failed to load data: ${error}`)
            }
        }

        render(resources.assigneeTaskList)
    }, [apiKey, resources])

    if (!apiKey) {
        return <Navigate to="/auth" replace />
    }

    if (invalidKey) {
        return <Navigate to="/auth?error=invalid_key" replace />
    }

    if (error) {
        return (
            <div className="flex items-center justify-start gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-900">
                <CircleAlert size={16} className="text-red-400" />
                <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
        )
    }

    return (
        <main className="flex size-full items-center justify-center">
            <div className="flex items-center justify-start gap-2.5 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
                {loading ? (
                    <div
                        className={`animate-pulse rounded-full bg-neutral-300 dark:bg-neutral-800 ${avatarSizeClasses}`}
                    ></div>
                ) : (
                    <>
                        {avatarSrc !== null ? (
                            <img
                                src={avatarSrc}
                                alt={username || 'Avatar'}
                                className={`rounded-full ${avatarSizeClasses}`}
                            />
                        ) : (
                            <div
                                className={`flex items-center justify-center rounded-full bg-neutral-800 dark:bg-neutral-200 ${avatarSizeClasses}`}
                            >
                                <p className="text-5xl font-bold tracking-wider text-neutral-200 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[160px] dark:text-neutral-800">
                                    {username
                                        ?.split(' ')
                                        .map((name) => name[0])
                                        .join('')}
                                </p>
                            </div>
                        )}
                    </>
                )}

                <div className="flex flex-col gap-0.75 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4">
                    {loading ? (
                        <div
                            className={`animate-pulse rounded-2xl bg-neutral-300 text-transparent dark:bg-neutral-800 ${nameTextClasses}`}
                        >
                            Max Mustermann
                        </div>
                    ) : (
                        <h1 className={nameTextClasses}>{username}</h1>
                    )}

                    {loading ? (
                        <div className={`${subtitleRowClasses}`}>
                            <div
                                className={`animate-pulse rounded-md bg-neutral-300 dark:bg-neutral-800 ${subtitleLogoClasses}`}
                                style={{ aspectRatio: '2.9 / 1' }}
                            />
                            <h4
                                className={`animate-pulse rounded-md bg-neutral-300 text-transparent dark:bg-neutral-800 ${subtitleTextClasses}`}
                            >
                                Tagesverantwortung
                            </h4>
                        </div>
                    ) : (
                        <div className={subtitleRowClasses}>
                            <img
                                src="./clickup-logo.svg"
                                alt="ClickUp Logo"
                                className={`${subtitleLogoClasses} ${!loading ? 'ml-0.5 sm:ml-0.75 md:ml-1.25 lg:ml-1.5 xl:ml-1.75 2xl:ml-2 dark:invert' : null}`}
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
