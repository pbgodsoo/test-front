<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { fetchBoardDetail, type BoardDetail } from '@/lib/api'
import { navigateTo } from '@/lib/router'

const props = defineProps<{
  idx: number
}>()

const board = ref<BoardDetail | null>(null)
const loading = ref(true)
const errorMessage = ref('')

async function loadBoard() {
  loading.value = true
  errorMessage.value = ''

  try {
    board.value = await fetchBoardDetail(props.idx)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

function formatDate(value: string) {
  if (!value) {
    return '작성 시각 없음'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(value))
}

onMounted(loadBoard)
watch(() => props.idx, loadBoard)
</script>

<template>
  <section class="page-card">
    <div class="page-head">
      <button class="ghost-button" type="button" @click="navigateTo('/board/list')">목록으로</button>
      <button class="ghost-button accent" type="button" @click="navigateTo('/board/reg')">새 글 작성</button>
    </div>

    <div v-if="loading" class="state-box">게시글을 불러오는 중입니다.</div>
    <div v-else-if="errorMessage" class="state-box error">{{ errorMessage }}</div>

    <article v-else-if="board" class="detail-panel">
      <p class="detail-index">POST #{{ board.idx }}</p>
      <h2>{{ board.title }}</h2>
      <time :datetime="board.createdAt">{{ formatDate(board.createdAt) }}</time>
      <div class="divider"></div>
      <p class="detail-contents">{{ board.contents }}</p>
    </article>
  </section>
</template>

<style scoped>
.page-card {
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: var(--bg-elevated);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow);
}

.page-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.ghost-button {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 16px;
  background: var(--surface-strong);
  cursor: pointer;
}

.ghost-button.accent {
  border-color: rgba(215, 90, 50, 0.22);
  color: var(--accent-deep);
}

.detail-panel {
  padding: 28px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 248, 241, 0.98));
  border: 1px solid rgba(215, 90, 50, 0.12);
}

.detail-index {
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.12em;
}

h2 {
  margin-top: 12px;
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.1;
  font-weight: 700;
}

time {
  display: inline-block;
  margin-top: 14px;
  color: var(--muted);
}

.divider {
  height: 1px;
  margin: 22px 0;
  background: var(--line);
}

.detail-contents {
  white-space: pre-wrap;
  font-size: 1.05rem;
}

.state-box {
  padding: 24px;
  border-radius: 20px;
  background: var(--surface-strong);
  border: 1px solid var(--line);
  color: var(--muted);
}

.error {
  color: #9e2a2b;
  background: rgba(158, 42, 43, 0.06);
}
</style>
