const CLICKUP_BASE_URL = "https://api.clickup.com/api/v2"
export const CLICKUP_OPEN_TASK_LIST_ID = "901202079960"

export type ClickUpAssignee = {
    username: string
    profilePicture: string | null
}

type ClickUpUserResponse = {
    user?: {
        id?: string
    }
}

type ClickUpListTasksResponse = {
    tasks?: Array<{
        assignees?: ClickUpAssignee[]
    }>
}

export class ClickUpApiError extends Error {
    status: number

    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = "ClickUpApiError"
    }
}

export function normalizeApiKey(value: string): string {
    return value.trim().replaceAll(" ", "+")
}

function createHeaders(apiKey: string): HeadersInit {
    return {
        accept: "application/json",
        Authorization: normalizeApiKey(apiKey),
    }
}

async function clickUpGet<T>(path: string, apiKey: string): Promise<T> {
    const response = await fetch(`${CLICKUP_BASE_URL}${path}`, {
        method: "GET",
        headers: createHeaders(apiKey),
    })

    if (!response.ok) {
        throw new ClickUpApiError(
            response.status,
            `ClickUp request failed with status ${response.status}`
        )
    }

    return (await response.json()) as T
}

export async function validateClickUpApiKey(apiKey: string): Promise<boolean> {
    try {
        const data = await clickUpGet<ClickUpUserResponse>("/user", apiKey)
        return Boolean(data.user?.id)
    } catch (error) {
        if (
            error instanceof ClickUpApiError &&
            (error.status === 401 || error.status === 403)
        ) {
            return false
        }
        throw error
    }
}

export async function fetchFirstOpenTaskAssignees(
    apiKey: string,
    listId = CLICKUP_OPEN_TASK_LIST_ID
): Promise<ClickUpAssignee[]> {
    const data = await clickUpGet<ClickUpListTasksResponse>(
        `/list/${listId}/task?include_closed=false`,
        apiKey
    )

    return data.tasks?.[0]?.assignees ?? []
}
