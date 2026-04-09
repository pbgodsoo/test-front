<script setup lang="ts">
import { reactive, ref } from 'vue'
import { createBoard } from '@/lib/api'
import { navigateTo } from '@/lib/router'

const form = reactive({
  title: '',
  contents: '',
})

const submitting = ref(false)
const errorMessage = ref('')

async function submitBoard() {
  errorMessage.value = ''

  if (!form.title.trim()) {
    errorMessage.value = '제목을 입력해주세요.'
    return
  }

  if (!form.contents.trim()) {
    errorMessage.value = '내용을 입력해주세요.'
    return
  }

  submitting.value = true

  try {
    const createdBoard = await createBoard({
      title: form.title.trim(),
      contents: form.contents.trim(),
    })

    navigateTo(`/board/${createdBoard.idx}`)
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '게시글 등록에 실패했습니다.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <section class="page-card">
    <div class="page-head">
      <div>
        <p class="section-label">Board Register</p>
        <h2>새 게시글 작성</h2>
        <p class="section-copy">제목과 내용을 입력하면 백엔드에 저장되고, 저장 직후 상세 화면으로 이동합니다.</p>
      </div>

      <button class="ghost-button" type="button" @click="navigateTo('/board/list')">목록으로</button>
    </div>

    <form class="form-panel" @submit.prevent="submitBoard">
      <label class="field">
        <span>제목</span>
        <input v-model="form.title" type="text" maxlength="100" placeholder="게시글 제목을 입력하세요." />
      </label>

      <label class="field">
        <span>내용</span>
        <textarea
          v-model="form.contents"
          rows="12"
          placeholder="게시글 내용을 작성하세요."
        ></textarea>
      </label>

      <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>

      <div class="form-actions">
        <button class="ghost-button" type="button" @click="navigateTo('/board/list')">취소</button>
        <button class="primary-button" type="submit" :disabled="submitting">
          {{ submitting ? '등록 중...' : '게시글 등록' }}
        </button>
      </div>
    </form>
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
  gap: 16px;
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
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  line-height: 1.1;
  font-weight: 700;
}

.section-copy {
  margin-top: 10px;
  color: var(--muted);
}

.form-panel {
  display: grid;
  gap: 18px;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  font-weight: 700;
}

.field input,
.field textarea {
  width: 100%;
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 16px 18px;
  background: var(--surface-strong);
  color: var(--text);
}

.field textarea {
  resize: vertical;
  min-height: 220px;
}

.field input:focus,
.field textarea:focus {
  outline: 2px solid rgba(215, 90, 50, 0.18);
  border-color: rgba(215, 90, 50, 0.32);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.ghost-button,
.primary-button {
  border-radius: 14px;
  padding: 12px 18px;
  cursor: pointer;
}

.ghost-button {
  border: 1px solid var(--line);
  background: var(--surface-strong);
}

.primary-button {
  border: 0;
  background: linear-gradient(135deg, var(--accent), var(--accent-deep));
  color: #fff;
}

.primary-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.error-text {
  color: #9e2a2b;
  font-weight: 700;
}
</style>
