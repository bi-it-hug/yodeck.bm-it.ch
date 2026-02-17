import { useEffect, useMemo, useState } from 'react'
import APIResource from './APIResource'
import { CircleAlert } from 'lucide-react'

export default function App() {
    const apiKey = useMemo(
        () => new URLSearchParams(window.location.search).get('key'),
        [],
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

    useEffect(() => {
        async function get(URL: string) {
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
                    return null
                }
                return await response.json()
            } catch (error) {
                console.error(`Error: Failed to fetch data: ${error}`)
                return null
            }
        }

        async function render(resource: APIResource) {
            if (!apiKey) {
                setError('API key is required')
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const data = await get(resource.URL)
                if (!data?.tasks?.[0]?.assignees?.[0]) {
                    setError('Wrong Key')
                    setLoading(false)
                    return
                }

                if (data.tasks[0].assignees.length > 1) {
                    setError('Cant assign multiple People')
                    setLoading(false)
                }

                const assignee = data.tasks[0].assignees[0]

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

    if (error) {
        return (
            <div className="flex items-center justify-start gap-3 rounded-[0.625rem] border border-neutral-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-neutral-900">
                <CircleAlert size={16} className="text-red-400" />
                <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
        )
    }

    return (
        <main className="flex size-full items-center justify-center">
            <div className="flex items-center justify-start gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">
                {loading ? (
                    <div className="flex size-30 animate-pulse items-center justify-center rounded-full bg-neutral-300 sm:size-40 md:size-50 lg:size-60 xl:size-70 2xl:size-80 dark:bg-neutral-800"></div>
                ) : (
                    <>
                        {avatarSrc !== null ? (
                            <img
                                src={avatarSrc}
                                alt={username || 'Avatar'}
                                className="size-30 rounded-full sm:size-40 md:size-50 lg:size-60 xl:size-70 2xl:size-80"
                            />
                        ) : (
                            <div className="flex size-30 items-center justify-center rounded-full bg-blue-200 sm:size-40 md:size-50 lg:size-60 xl:size-70 2xl:size-80">
                                <p className="text-5xl font-bold tracking-wider text-black opacity-25 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[160px]">
                                    {username
                                        ?.split(' ')
                                        .map((name) => name[0])
                                        .join('')}
                                </p>
                            </div>
                        )}
                    </>
                )}

                <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 xl:gap-3.5 2xl:gap-4">
                    {loading ? (
                        <div className="w-150 animate-pulse rounded-2xl bg-neutral-300 text-4xl font-bold text-transparent sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl dark:bg-neutral-800">
                            .
                        </div>
                    ) : (
                        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl">
                            {username}
                        </h1>
                    )}

                    <div className="relative">
                        {loading ? (
                            <div className="absolute inset-0 size-full h-max w-93.25 animate-pulse rounded-2xl bg-neutral-300 text-transparent dark:bg-neutral-800">
                                .
                            </div>
                        ) : (
                            <div className="ml-1 flex items-center justify-start gap-2 sm:ml-0.75 md:ml-1.25 lg:ml-1.5 xl:ml-1.75 2xl:ml-2">
                                <img
                                    src="./clickup-logo.svg"
                                    alt="ClickUp Logo"
                                    className="h-6 xl:h-8 2xl:h-10 dark:invert"
                                />
                                <h4 className="text-lg font-medium lg:text-xl xl:text-2xl 2xl:text-3xl">
                                    Tagesverantwortung
                                </h4>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}
