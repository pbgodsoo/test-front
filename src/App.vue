<script setup lang="ts">
import { computed } from 'vue'
import BoardDetailPage from './views/BoardDetailPage.vue'
import BoardListPage from './views/BoardListPage.vue'
import BoardRegPage from './views/BoardRegPage.vue'
import { currentPath, navigateTo, startRouter } from './lib/router'

startRouter()

const currentView = computed(() => {
  if (currentPath.value === '/board/list' || currentPath.value === '/') {
    return { component: BoardListPage, props: {} }
  }

  if (currentPath.value === '/board/reg') {
    return { component: BoardRegPage, props: {} }
  }

  const boardMatch = currentPath.value.match(/^\/board\/(\d+)$/)
  if (boardMatch) {
    return {
      component: BoardDetailPage,
      props: { idx: Number(boardMatch[1]) },
    }
  }

  return { component: BoardListPage, props: {} }
})
</script>

<template>
  <div class="app-shell">
    <div class="hero-panel">
      <p class="eyebrow">Board Workspace</p>
      <h1>게시글 작성, 조회, 목록을 한 흐름으로 연결한 보드 앱2</h1>
      <p class="hero-copy">
        백엔드 API와 직접 연결되어 등록 즉시 목록과 상세에서 확인할 수 있습니다.
      </p>

      <nav class="hero-nav">
        <a href="/board/list" @click.prevent="navigateTo('/board/list')">목록</a>
        <a href="/board/reg" @click.prevent="navigateTo('/board/reg')">글쓰기</a>
      </nav>
    </div>

    <main class="content-panel">
      <component :is="currentView.component" v-bind="currentView.props" />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  gap: 24px;
  min-height: calc(100vh - 64px);
}

.hero-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background:
    radial-gradient(circle at top, rgba(245, 114, 79, 0.22), transparent 42%),
    linear-gradient(180deg, rgba(14, 27, 56, 0.96), rgba(18, 43, 79, 0.88));
  color: #f8f2ec;
  box-shadow: 0 24px 60px rgba(10, 21, 41, 0.22);
}

.eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(248, 242, 236, 0.72);
}

h1 {
  margin-top: 16px;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 1.05;
  font-weight: 700;
}

.hero-copy {
  margin-top: 16px;
  color: rgba(248, 242, 236, 0.78);
}

.hero-nav {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.hero-nav a {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.hero-nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.content-panel {
  min-width: 0;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .hero-panel {
    gap: 24px;
  }
}
</style>
