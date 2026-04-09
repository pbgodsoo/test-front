import { ref } from 'vue'

export const currentPath = ref(window.location.pathname || '/board/list')

let isStarted = false

export function startRouter() {
  if (isStarted) {
    return
  }

  isStarted = true
  currentPath.value = window.location.pathname || '/board/list'
  window.addEventListener('popstate', syncCurrentPath)
}

export function navigateTo(path: string) {
  if (window.location.pathname === path) {
    return
  }

  window.history.pushState({}, '', path)
  syncCurrentPath()
}

function syncCurrentPath() {
  currentPath.value = window.location.pathname || '/board/list'
}
