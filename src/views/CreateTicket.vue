<template>
  <section class="page">
    <div class="card">
      <header class="card__header">
        <h1>Nowe zgłoszenie</h1>
        <p class="subtitle">Utwórz ticket z linkiem, liczbą widzów, opisem i kodami.</p>
      </header>

      <form class="form" @submit.prevent="onSubmit" novalidate>
        <!-- URL -->
        <div class="field">
          <label for="url">URL <span class="req" aria-hidden="true">*</span></label>
          <input
            id="url"
            v-model.trim="form.url"
            type="url"
            inputmode="url"
            placeholder="https://…"
            @blur="validateField('url')"
            :aria-invalid="!!errors.url"
            :aria-describedby="errors.url ? 'url-error' : undefined"
            required
          />
          <p v-if="errors.url" id="url-error" class="error">{{ errors.url }}</p>
        </div>

        <!-- Liczba widzów -->
        <div class="field">
          <label for="viewers">Liczba widzów <span class="req" aria-hidden="true">*</span></label>
          <input
            id="viewers"
            v-model.number="form.viewers"
            type="number"
            inputmode="numeric"
            min="0"
            step="1"
            placeholder="np. 1200"
            @blur="validateField('viewers')"
            :aria-invalid="!!errors.viewers"
            :aria-describedby="errors.viewers ? 'viewers-error' : undefined"
            required
          />
          <p v-if="errors.viewers" id="viewers-error" class="error">{{ errors.viewers }}</p>
        </div>

        <!-- Opis -->
        <div class="field field--full">
          <label for="description">Opis</label>
          <textarea
            id="description"
            v-model.trim="form.description"
            rows="4"
            placeholder="Krótki opis zgłoszenia…"
          ></textarea>
        </div>

        <!-- Kody -->
        <div class="field field--full">
          <label for="codeInput">Kody</label>

          <div class="codes">
            <div class="code-input-row">
              <input
                id="codeInput"
                ref="codeInputRef"
                v-model.trim="newCode"
                type="text"
                placeholder="Wpisz kod i naciśnij Enter lub kliknij ➕"
                @keydown.enter.prevent="addCode()"
                @keydown.tab.exact.prevent="addCode()"
                maxlength="64"
              />
              <button
                type="button"
                class="btn btn--ghost"
                @click="addCode()"
                aria-label="Dodaj kod"
              >
                ➕
              </button>
            </div>

            <transition-group name="list" tag="ul" class="code-list" aria-live="polite">
              <li v-for="c in form.codes" :key="c.id" class="code-item">
                <template v-if="!c.isEditing">
                  <span class="code-chip" :title="c.value">{{ c.value }}</span>
                  <div class="code-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      @click="startEdit(c)"
                      aria-label="Edytuj kod"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      class="icon-btn danger"
                      @click="removeCode(c.id)"
                      aria-label="Usuń kod"
                    >
                      🗑️
                    </button>
                  </div>
                </template>
                <template v-else>
                  <input
                    class="code-edit"
                    type="text"
                    v-model.trim="c.editValue"
                    maxlength="64"
                    @keydown.enter.prevent="confirmEdit(c)"
                    @keydown.esc.prevent="cancelEdit(c)"
                  />
                  <div class="code-actions">
                    <button
                      type="button"
                      class="icon-btn"
                      @click="confirmEdit(c)"
                      aria-label="Zapisz"
                    >
                      ✔️
                    </button>
                    <button
                      type="button"
                      class="icon-btn"
                      @click="cancelEdit(c)"
                      aria-label="Anuluj"
                    >
                      ↩️
                    </button>
                  </div>
                </template>
              </li>
            </transition-group>
          </div>
        </div>

        <!-- Akcje formularza -->
        <div class="actions">
          <button type="submit" class="btn">Utwórz zgłoszenie</button>
          <button type="button" class="btn btn--ghost" @click="resetForm">Wyczyść</button>
        </div>
      </form>

      <footer class="card__footer">
        <p class="hint">
          Wskazówka: użyj <kbd>Enter</kbd> lub <kbd>Tab</kbd> aby szybko dodawać kolejne kody.
        </p>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { addTicket } from '@/api/serviceApi'
import { reactive, ref } from 'vue'

type CodeItem = { id: number; value: string; isEditing?: boolean; editValue?: string }

type TicketForm = {
  url: string
  viewers: number | null
  description: string
  codes: CodeItem[]
}

const form = reactive<TicketForm>({
  url: '',
  viewers: null,
  description: '',
  codes: [],
})

const errors = reactive<{ [k in keyof TicketForm]?: string }>({})

const newCode = ref('')
const codeInputRef = ref<HTMLInputElement | null>(null)
let uid = 0

function validateField(field: keyof TicketForm) {
  switch (field) {
    case 'url': {
      if (!form.url) {
        errors.url = 'URL jest wymagany.'
      } else if (!isValidUrl(form.url)) {
        errors.url = 'Podaj poprawny adres URL (z http/https).'
      } else {
        delete errors.url
      }
      break
    }
    case 'viewers': {
      if (form.viewers === null || form.viewers === undefined || Number.isNaN(form.viewers)) {
        errors.viewers = 'Liczba widzów jest wymagana.'
      } else if (form.viewers < 0) {
        errors.viewers = 'Liczba widzów nie może być ujemna.'
      } else if (!Number.isInteger(form.viewers)) {
        errors.viewers = 'Podaj liczbę całkowitą.'
      } else {
        delete errors.viewers
      }
      break
    }
  }
}

function isValidUrl(v: string) {
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function addCode() {
  const val = newCode.value.trim()
  if (!val) return
  form.codes.push({ id: Date.now() + uid++, value: val })
  newCode.value = ''
  // focus z powrotem na input kodu
  requestAnimationFrame(() => codeInputRef.value?.focus())
}

function removeCode(id: number) {
  form.codes = form.codes.filter((c) => c.id !== id)
}

function startEdit(c: CodeItem) {
  c.isEditing = true
  c.editValue = c.value
}

function confirmEdit(c: CodeItem) {
  const v = (c.editValue ?? '').trim()
  if (v) c.value = v
  c.isEditing = false
  delete c.editValue
}

function cancelEdit(c: CodeItem) {
  c.isEditing = false
  delete c.editValue
}

function resetForm() {
  form.url = ''
  form.viewers = null
  form.description = ''
  form.codes = []
  Object.keys(errors).forEach((k) => delete (errors as any)[k])
  newCode.value = ''
}

function validateAll() {
  validateField('url')
  validateField('viewers')
  return Object.keys(errors).length === 0
}

function onSubmit() {
  if (!validateAll()) return
  const payload = {
    clinetId: 1,
    url: form.url.trim(),
    viewers: form.viewers ?? 0,
    description: form.description.trim(),
    codes: form.codes.map((c) => c.value),
  }
  // TODO: Wyślij payload do API
  console.log('Ticket payload', payload)
  addTicket(payload)
    .then((res) => {
      console.log('Ticket added', res)
    })
    .catch((err) => {
      console.error('Error adding ticket', err)
    })
  resetForm()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.page {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
}

/* opcjonalnie: nagłówki wyróżnij grubiej */
h1 {
  font-weight: 700;
  letter-spacing: -0.3px;
}
.subtitle {
  font-weight: 400;
}
.btn {
  font-family: inherit;
  font-weight: 600;
}
/* Layout */
.page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: clamp(16px, 3vw, 32px);
  background: linear-gradient(160deg, #0f172a 0%, #111827 60%, #0b1220 100%);
}

.card {
  width: min(100%, 980px);
  background: #0b1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: clamp(16px, 3vw, 28px);
  color: #f1f5f9;
}

.card__header {
  margin-bottom: 12px;
}
.card__footer {
  margin-top: 10px;
  opacity: 0.8;
}

h1 {
  font-size: clamp(22px, 3vw, 28px);
  margin: 0 0 6px;
  letter-spacing: 0.2px;
}
.subtitle {
  margin: 0;
  font-size: 14px;
  color: #cbd5e1;
}
.hint {
  font-size: 12px;
  color: #94a3b8;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field--full {
  grid-column: 1 / -1;
}

label {
  font-size: 14px;
  color: #e2e8f0;
}
.req {
  color: #fda4af;
}

/* Inputs */
input[type='text'],
input[type='url'],
input[type='number'],
textarea {
  appearance: none;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

input:focus,
textarea:focus {
  border-color: #7dd3fc;
  box-shadow: 0 0 0 4px rgba(125, 211, 252, 0.15);
  background: #0b1220;
}

textarea {
  resize: vertical;
}

.error {
  color: #fca5a5;
  font-size: 12px;
}

/* Codes UI */
.codes {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.code-input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.code-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}

.code-item {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #0f172a;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 12px;
}

.code-chip {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(125, 211, 252, 0.08);
  border: 1px solid rgba(125, 211, 252, 0.25);
  font-size: 13px;
}

.code-edit {
  width: 100%;
  background: #0b1220;
  border: 1px dashed rgba(148, 163, 184, 0.35);
  padding: 8px 10px;
  border-radius: 10px;
  color: #e5e7eb;
}

.code-actions {
  display: flex;
  gap: 6px;
}

.icon-btn {
  cursor: pointer;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: #0b1220;
  color: #e2e8f0;
  border-radius: 10px;
  padding: 6px 8px;
  font-size: 14px;
  transition:
    transform 0.08s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}
.icon-btn:hover {
  background: #111827;
}
.icon-btn:active {
  transform: translateY(1px);
}
.icon-btn.danger {
  border-color: rgba(252, 165, 165, 0.35);
}

/* Buttons */
.actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 4px;
}

.btn {
  cursor: pointer;
  border: none;
  background: linear-gradient(180deg, #60a5fa, #38bdf8);
  color: #0b1220;
  padding: 12px 16px;
  font-weight: 700;
  border-radius: 12px;
  letter-spacing: 0.2px;
  transition:
    filter 0.15s ease,
    transform 0.08s ease;
}
.btn:hover {
  filter: brightness(1.05);
}
.btn:active {
  transform: translateY(1px);
}

.btn--ghost {
  background: transparent;
  color: #e5e7eb;
  border: 1px solid rgba(148, 163, 184, 0.3);
}
.btn--ghost:hover {
  background: rgba(148, 163, 184, 0.08);
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.16s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}
.list-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* Responsive */
@media (max-width: 720px) {
  .form {
    grid-template-columns: 1fr;
  }
  .actions {
    justify-content: stretch;
  }
  .btn {
    width: 100%;
  }
}
</style>
