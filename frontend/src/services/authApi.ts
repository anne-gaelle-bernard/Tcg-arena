export type AuthUser = {
  player_id: number
  username: string
  mail: string
  level: number
}

type ApiResponse<T> = {
  message: string
  user: T
}

async function apiRequest<T>(url: string, payload: Record<string, string>) {
  let response: Response

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error('Cannot reach API. Start backend with: npm run dev:api')
  }

  const rawBody = await response.text()
  let data: Partial<ApiResponse<T>> & { message?: string } = {}

  if (rawBody) {
    try {
      data = JSON.parse(rawBody) as Partial<ApiResponse<T>> & { message?: string }
    } catch {
      data = { message: rawBody }
    }
  }

  if (!response.ok) {
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('Backend API unavailable. Start it with: npm run dev:api')
    }

    if (response.status >= 500) {
      throw new Error('Server error. Check backend logs and restart API.')
    }

    throw new Error(data.message || `Request failed (${response.status}).`)
  }

  if (!data.user) {
    throw new Error('Invalid API response format.')
  }

  return {
    message: data.message || 'Success',
    user: data.user,
  } as ApiResponse<T>
}

export async function registerUser(username: string, email: string, password: string) {
  return apiRequest<AuthUser>('/api/auth/register', {
    username,
    email,
    password,
  })
}

export async function loginUser(email: string, password: string) {
  return apiRequest<AuthUser>('/api/auth/login', {
    email,
    password,
  })
}
