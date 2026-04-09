export interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface BoardListItem {
  idx: number
  title: string
  contentsPreview: string
  createdAt: string
}

export interface BoardDetail {
  idx: number
  title: string
  contents: string
  createdAt: string
}

export interface BoardRegPayload {
  title: string
  contents: string
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const payload = (await response.json()) as ApiResponse<T> | { message?: string }

  if (!response.ok) {
    const message = 'message' in payload && payload.message ? payload.message : '요청 처리 중 오류가 발생했습니다.'
    throw new Error(message)
  }

  if (!('data' in payload)) {
    throw new Error('응답 형식이 올바르지 않습니다.')
  }

  return payload.data
}

export function fetchBoardList() {
  return request<BoardListItem[]>('/board/list')
}

export function fetchBoardDetail(idx: number) {
  return request<BoardDetail>(`/board/${idx}`)
}

export function createBoard(payload: BoardRegPayload) {
  return request<BoardDetail>('/board/reg', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
