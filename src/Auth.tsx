import { normalizeApiKey, validateClickUpApiKey } from "@/clickup"
import { useLocation, useNavigate } from "react-router-dom"
import { type SyntheticEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function Auth() {
    const navigate = useNavigate()
    const location = useLocation()
    const [apiKey, setApiKey] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)
    const [hasEditedKey, setHasEditedKey] = useState(false)
    const hasInvalidKeyError =
        new URLSearchParams(location.search).get("error") === "invalid_key"
    const shouldShowInvalidKeyError = hasInvalidKeyError && !hasEditedKey
    const activeError =
        formError ||
        (shouldShowInvalidKeyError
            ? "Invalid API key. Please try again."
            : null)

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault()
        const normalizedKey = normalizeApiKey(apiKey)
        if (!normalizedKey) {
            return
        }

        setIsSubmitting(true)
        setFormError(null)

        try {
            const isValidKey = await validateClickUpApiKey(normalizedKey)
            if (!isValidKey) {
                setFormError("Invalid API key.")
                return
            }

            navigate(`/?key=${encodeURIComponent(normalizedKey)}`, {
                replace: true,
            })
        } catch {
            setFormError("Could not verify API key.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="flex size-full items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xs rounded-xl border p-6"
            >
                <FieldGroup>
                    <FieldSet>
                        <FieldLegend>Authentication</FieldLegend>
                        <FieldDescription>
                            Enter a valid ClickUp API Key
                        </FieldDescription>
                        <FieldGroup>
                            <Field data-invalid={Boolean(activeError)}>
                                <FieldLabel htmlFor="api-key">
                                    API Key
                                </FieldLabel>
                                <Input
                                    type="text"
                                    id="api-key"
                                    value={apiKey}
                                    aria-invalid={Boolean(activeError)}
                                    onChange={(event) => {
                                        setApiKey(event.target.value)
                                        if (!hasEditedKey) {
                                            setHasEditedKey(true)
                                        }
                                        if (formError) {
                                            setFormError(null)
                                        }
                                    }}
                                    placeholder="pk_A7xQ2mN9rT5v"
                                    size={10}
                                    required
                                    className="w-[60vw] max-w-65"
                                />
                                <FieldError>{activeError}</FieldError>
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <Field orientation="horizontal">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="smr-auto"
                        >
                            {isSubmitting ? "Checking..." : "Submit"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </main>
    )
}
