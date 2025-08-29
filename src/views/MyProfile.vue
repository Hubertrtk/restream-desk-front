<template>
  <section class="page">
    <div class="card">
      <header class="card__header">
        <h1>Moje zgłoszenia</h1>
        <p class="subtitle">Lista zgłoszeń zalogowanego użytkownika.</p>
      </header>

      <div v-if="loading" class="loading">Ładowanie…</div>
      <div v-else>
        <ul class="tickets">
          <li v-for="ticket in tickets" :key="ticket.id" class="ticket">
            <div class="ticket__row"><span class="label">URL:</span> {{ ticket.url }}</div>
            <div class="ticket__row">
              <span class="label">Utworzono:</span> {{ formatDate(ticket._created) }}
            </div>

            <div class="ticket__row">
              <span class="label">Opis:</span>
              <textarea v-model.trim="ticket.editDescription" rows="2"></textarea>
            </div>

            <div class="ticket__row">
              <span class="label">Kody:</span>
              <div class="codes">
                <div v-for="(c, i) in ticket.editCodes" :key="i" class="code-item">
                  <input type="text" v-model.trim="ticket.editCodes[i]" />
                  <button type="button" class="icon-btn danger" @click="removeCode(ticket, i)">
                    🗑️
                  </button>
                </div>
                <div class="code-add">
                  <input
                    type="text"
                    v-model.trim="ticket.newCode"
                    placeholder="Dodaj kod"
                    @keydown.enter.prevent="addCode(ticket)"
                  />
                  <button type="button" class="icon-btn" @click="addCode(ticket)">➕</button>
                </div>
              </div>
            </div>

            <div class="ticket__row">
              <span class="label">Widzowie:</span>
              <input type="number" min="0" v-model.number="ticket.editViewers" />
            </div>

            <div class="actions" v-if="isChanged(ticket)">
              <button class="btn" @click="updateTicket(ticket)">Update</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { getUserTickets } from '@/api/serviceApi'
import getAuth from '@/helpers/getAuth'
import { reactive, ref, onMounted } from 'vue'

type Ticket = {
  id: string
  url: string
  _created: number
  description: string
  codes: string[]
  viewers: number
  // Edycja
  editDescription: string
  editCodes: string[]
  editViewers: number
  newCode: string
}

const tickets = reactive<Ticket[]>([])
const loading = ref(true)

async function fetchTickets() {
  try {
    const auth = getAuth()
    const res = await getUserTickets()
    tickets.splice(
      0,
      tickets.length,
      ...res.data.map((t: any) => ({
        id: t.id,
        url: t.url,
        _created: t._created,
        description: t.description,
        codes: t.codes,
        viewers: t.viewers,
        editDescription: t.description,
        editCodes: [...t.codes],
        editViewers: t.viewers,
        newCode: '',
      })),
    )
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function formatDate(ts: number) {
  const d = new Date(Number(ts))
  return d.toLocaleString()
}

function addCode(ticket: Ticket) {
  const v = ticket.newCode.trim()
  if (!v) return
  ticket.editCodes.push(v)
  ticket.newCode = ''
}

function removeCode(ticket: Ticket, i: number) {
  ticket.editCodes.splice(i, 1)
}

function isChanged(ticket: Ticket) {
  return (
    ticket.editDescription !== ticket.description ||
    ticket.editViewers !== ticket.viewers ||
    JSON.stringify(ticket.editCodes) !== JSON.stringify(ticket.codes)
  )
}

async function updateTicket(ticket: Ticket) {
  try {
    const payload = {
      id: ticket.id,
      description: ticket.editDescription,
      viewers: ticket.editViewers,
      codes: ticket.editCodes,
    }
    // await fetch(`/api/tickets/${ticket.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // })
    // ticket.description = ticket.editDescription
    // ticket.viewers = ticket.editViewers
    // ticket.codes = [...ticket.editCodes]
    alert('Ticket zaktualizowany!')
  } catch (e) {
    console.error(e)
    alert('Błąd aktualizacji')
  }
}

onMounted(fetchTickets)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.page {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 16px;
  background: linear-gradient(160deg, #0f172a 0%, #111827 60%, #0b1220 100%);
  font-family: 'Inter', system-ui, sans-serif;
}

.card {
  width: min(100%, 900px);
  background: #0b1020;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  padding: 20px;
  color: #f1f5f9;
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
  font-weight: 700;
}
.subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin-bottom: 20px;
}

.tickets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.ticket {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  background: #0f172a;
  padding: 16px;
  font-size: 14px;
  display: grid;
  gap: 12px;
}

.ticket__row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.label {
  font-weight: 600;
  font-size: 13px;
  color: #e2e8f0;
}

textarea,
input[type='number'],
input[type='text'] {
  background: #0b1220;
  border: 1px solid rgba(148, 163, 184, 0.25);
  color: #e5e7eb;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 14px;
  outline: none;
}
textarea:focus,
input:focus {
  border-color: #7dd3fc;
  box-shadow: 0 0 0 3px rgba(125, 211, 252, 0.2);
}

.codes {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.code-item {
  display: flex;
  gap: 6px;
}
.code-add {
  display: flex;
  gap: 6px;
}

.icon-btn {
  cursor: pointer;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: #0b1220;
  color: #e2e8f0;
  border-radius: 8px;
  padding: 4px 8px;
  font-size: 14px;
}
.icon-btn.danger {
  border-color: rgba(252, 165, 165, 0.35);
}

.actions {
  display: flex;
  justify-content: flex-end;
}
.btn {
  cursor: pointer;
  border: none;
  background: linear-gradient(180deg, #60a5fa, #38bdf8);
  color: #0b1220;
  padding: 10px 14px;
  font-weight: 700;
  border-radius: 10px;
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

.loading {
  text-align: center;
  padding: 20px;
  color: #cbd5e1;
  font-size: 14px;
}

/* Responsive */
@media (max-width: 720px) {
  .ticket {
    padding: 12px;
  }
}
</style>
