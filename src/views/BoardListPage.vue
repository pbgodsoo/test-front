<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { fetchBoardList, type BoardListItem } from '@/lib/api'
import { navigateTo } from '@/lib/router'

const boards = ref<BoardListItem[]>([])
const loading = ref(true)
const errorMessage = ref('')

const totalCount = computed(() => boards.value.length)

async function loadBoards() {
  loading.value = true
  errorMessage.value = ''

  try {
    boards.value = await fetchBoardList()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '목록을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

function formatDate(value: string) {
  if (!value) {
    return '작성 시각 없음'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

onMounted(loadBoards)
</script>

<template>
  <section class="page-card">
    <div class="page-head">
      <div>
        <p class="section-label">Board List</p>
        <h2>게시글 목록</h2>
        <p class="section-copy">지금 등록된 글을 한 번에 보고, 필요한 글로 바로 이동할 수 있습니다.</p>
      </div>

      <div class="head-actions">
        <span class="count-chip">총 {{ totalCount }}건</span>
        <button class="primary-button" type="button" @click="navigateTo('/board/reg')">새 글 작성</button>
      </div>
    </div>

    <div v-if="loading" class="state-box">게시글을 불러오는 중입니다.</div>
    <div v-else-if="errorMessage" class="state-box error">{{ errorMessage }}</div>
    <div v-else-if="boards.length === 0" class="state-box">아직 등록된 게시글이 없습니다. 첫 글을 작성해보세요.</div>

    <div v-else class="board-grid">
      <article
        v-for="board in boards"
        :key="board.idx"
        class="board-card"
        @click="navigateTo(`/board/${board.idx}`)"
      >
        <div class="card-top">
          <span>#{{ board.idx }}</span>
          <time :datetime="board.createdAt">{{ formatDate(board.createdAt) }}</time>
        </div>
        <h3>{{ board.title }}</h3>
        <p>{{ board.contentsPreview || '내용이 비어 있습니다.' }}</p>
      </article>
    </div>
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

.page-head,
.head-actions,
.card-top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.page-head {
  align-items: end;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.section-label {
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.78rem;
  font-weight: 700;
}

h2 {
  margin-top: 8px;
  font-size: clamp(1.8rem, 3vw, 2.7rem);
  line-height: 1.1;
  font-weight: 700;
}

.section-copy {
  margin-top: 10px;
  color: var(--muted);
}

.head-actions {
  align-items: center;
  flex-wrap: wrap;
}

.count-chip {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(215, 90, 50, 0.08);
  color: var(--accent-deep);
  font-weight: 700;
}

.primary-button {
  border: 0;
  border-radius: 14px;
  padding: 12px 18px;
  background: linear-gradient(135deg, var(--accent), var(--accent-deep));
  color: #fff;
  cursor: pointer;
}

.board-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.board-card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface-strong);
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.board-card:hover {
  transform: translateY(-4px);
  border-color: rgba(215, 90, 50, 0.26);
  box-shadow: 0 16px 40px rgba(24, 28, 44, 0.1);
}

.card-top {
  align-items: center;
  color: var(--muted);
  font-size: 0.9rem;
}

h3 {
  margin-top: 16px;
  font-size: 1.2rem;
  font-weight: 700;
}

.board-card p {
  margin-top: 12px;
  color: var(--muted);
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
