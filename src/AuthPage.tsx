import { type FormEvent, useState } from 'react'
import { CircleAlert } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import APIResource from './APIResource'

export default function AuthPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const [apiKey, setApiKey] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const hasInvalidKeyError =
        new URLSearchParams(location.search).get('error') === 'invalid_key'

    async function validateApiKey(key: string) {
        const resource = new APIResource('901202079960', 'task-list')
        const response = await fetch(resource.URL, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: key,
            },
        })

        if (!response.ok) {
            return false
        }

        const data = await response.json()
        return Boolean(data?.tasks?.[0]?.assignees?.[0])
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const trimmedKey = apiKey.trim()
        if (!trimmedKey) {
            return
        }

        setIsSubmitting(true)
        setFormError(null)

        try {
            const isValidKey = await validateApiKey(trimmedKey)
            if (!isValidKey) {
                setFormError('Invalid API key.')
                return
            }

            navigate(`/?key=${encodeURIComponent(trimmedKey)}`, {
                replace: true,
            })
        } catch {
            setFormError('Could not verify API key.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex size-full items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="relative flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-200"
            >
                {formError || hasInvalidKeyError ? (
                    <div className="absolute top-full right-0 left-0 mx-auto mt-3 flex w-fit max-w-65 items-center gap-2 rounded-lg border border-red-400/25 bg-red-400/10 px-2.5 py-1">
                        <CircleAlert size={16} className="text-red-400" />
                        <p className="font-serif text-sm font-normal text-red-400">
                            {formError || 'Invalid API key. Please try again.'}
                        </p>
                    </div>
                ) : null}

                <div>
                    <h2 className="mb-1.5 font-serif font-medium">
                        Authentication
                    </h2>
                    <p className="text-left font-serif text-sm leading-normal font-normal text-[#a1a1a1] last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4">
                        Enter a valid ClickUp API Key
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <label
                        htmlFor="api-key"
                        className="font-serif text-sm font-normal text-neutral-800 dark:text-neutral-50"
                    >
                        API Key
                    </label>

                    <input
                        type="text"
                        id="api-key"
                        value={apiKey}
                        onChange={(event) => {
                            setApiKey(event.target.value)
                            if (formError) {
                                setFormError(null)
                            }
                        }}
                        placeholder="pk_live_A7xQ2mN9rT5vL1zK8cD4fGh6YpS3uW0e"
                        size={10}
                        required
                        className="h-8 w-[60vw] max-w-65 rounded-lg border border-neutral-200 bg-white px-2.5 py-1 font-serif text-sm font-normal outline outline-transparent placeholder:text-[#a1a1a1] focus-visible:outline-neutral-300 dark:border-white/15 dark:bg-[#161616] dark:focus-visible:outline-neutral-700"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="smr-auto relative size-fit h-8 overflow-hidden rounded-lg bg-neutral-900 px-2.5 font-serif text-sm font-medium text-neutral-50 after:absolute after:inset-0 after:bg-white/40 after:opacity-0 hover:cursor-pointer active:after:opacity-100 dark:bg-neutral-200 dark:text-neutral-800 dark:after:bg-black/40 dark:hover:bg-neutral-300"
                >
                    {isSubmitting ? 'Checking...' : 'Submit'}
                </button>
            </form>
        </main>
    )
}
