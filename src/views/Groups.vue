<template>
  <section class="page">
    <div class="card">
      <header class="card__header">
        <h1>Grupy zgłoszeń</h1>
        <p class="subtitle">Kliknij grupę, aby rozwinąć listę ticketów.</p>
      </header>

      <div v-if="loading" class="loading">Ładowanie…</div>
      <div v-else>
        <ul class="groups">
          <li v-for="group in groups" :key="group.groupId" class="group">
            <div class="group__header-container">
              <button class="group__header" @click="toggleGroup(group)">
                <div class="group__info">
                  <span class="url">{{ group.url }}</span>
                  <span class="status" :class="group.status">{{ group.status }}</span>
                </div>
                <div class="group__meta">
                  <span v-if="group.status === 'closed'">
                    Zamknięto: {{ formatDate(group.closeTs) }}
                  </span>
                  <span v-else>Aktywna</span>
                </div>
              </button>

              <button class="close-btn" @click="closeGroup(group.url)">Close Group</button>
            </div>

            <transition name="expand">
              <ul v-if="openGroups[group.groupId]" class="tickets">
                <li v-if="group.loadingTickets" class="loading">Ładowanie ticketów…</li>
                <li v-for="ticket in group.tickets" :key="ticket.id" class="ticket">
                  <div class="ticket__row">
                    <span class="label">Widzowie:</span> {{ ticket.viewers }}
                  </div>
                  <div class="ticket__row">
                    <span class="label">Utworzone przez:</span> {{ ticket.createdBy }}
                  </div>
                  <div class="ticket__row">
                    <span class="label">Opis:</span> {{ ticket.description }}
                  </div>
                  <div class="ticket__row">
                    <span class="label">Kody:</span>
                    <ul class="codes">
                      <li v-for="c in ticket.codes" :key="c" class="code-chip">{{ c }}</li>
                    </ul>
                  </div>
                  <div class="ticket__row">
                    <span class="label">Status:</span> {{ ticket.status }}
                  </div>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { closeTicketsGroup, getGroups, getGroupTickets } from '@/api/serviceApi'
import { reactive, ref, onMounted } from 'vue'

type Group = {
  url: string
  productId: string
  closeTs?: string
  status: string
  groupId: string
  tickets?: any[]
  loadingTickets?: boolean
}

const groups = reactive<Group[]>([])
const openGroups = reactive<Record<string, boolean>>({})
const loading = ref(true)

async function fetchGroups() {
  try {
    const groupsRes = await getGroups()
    groups.splice(0, groups.length, ...groupsRes.data)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function toggleGroup(group: Group) {
  openGroups[group.groupId] = !openGroups[group.groupId]
  if (openGroups[group.groupId] && !group.tickets) {
    group.loadingTickets = true
    try {
      const res = await getGroupTickets(group.groupId)
      group.tickets = res.data
    } catch (e) {
      console.error(e)
    } finally {
      group.loadingTickets = false
    }
  }
}

function closeGroup(url: Group) {
  console.log(url)
  closeTicketsGroup({ url })
    .then((r) => {
      console.log(r)
    })
    .catch((e) => {
      console.error(e)
    })
}

function formatDate(ts?: string) {
  if (!ts) return ''
  const d = new Date(Number(ts))
  return d.toLocaleString()
}

onMounted(fetchGroups)
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

.groups {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.group {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  overflow: hidden;
  background: #0f172a;
}

.group__header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.group__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  background: none;
  border: none;
  color: inherit;
  text-align: left;
  padding: 14px 16px;
  cursor: pointer;
}

.close-btn {
  margin-right: 10px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #f87171;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: rgba(248, 113, 113, 0.25);
  transform: scale(1.05);
}
.close-btn:active {
  transform: scale(0.95);
}

.group__info {
  display: flex;
  flex-direction: column;
}
.url {
  font-weight: 600;
  font-size: 15px;
  color: #e2e8f0;
}
.status {
  font-size: 13px;
  text-transform: uppercase;
}
.status.open {
  color: #34d399;
}
.status.closed {
  color: #f87171;
}

.group__meta {
  font-size: 12px;
  color: #94a3b8;
}

.tickets {
  padding: 10px 16px 16px;
  display: grid;
  gap: 12px;
}
.ticket {
  border: 1px solid rgba(148, 163, 184, 0.15);
  border-radius: 10px;
  padding: 10px;
  background: #111827;
  font-size: 14px;
}
.ticket__row {
  margin-bottom: 6px;
}
.label {
  font-weight: 600;
  margin-right: 6px;
}

.codes {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.code-chip {
  background: rgba(125, 211, 252, 0.08);
  border: 1px solid rgba(125, 211, 252, 0.25);
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 13px;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #cbd5e1;
  font-size: 14px;
}

/* Animacje */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

.close-btn {
  margin-right: 10px;
  background: rgba(248, 113, 113, 0.1);
  border: 1px solid rgba(248, 113, 113, 0.4);
  color: #f87171;
  border-radius: 999px;
  padding: 6px 14px; /* nieco szersze, żeby tekst się dobrze mieścił */
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-btn:hover {
  background: rgba(248, 113, 113, 0.25);
  transform: scale(1.05);
}
.close-btn:active {
  transform: scale(0.95);
}

/* Responsive */
@media (max-width: 720px) {
  .group__header-container {
    flex-direction: column;
    align-items: stretch;
  }
  .close-btn {
    align-self: flex-end;
    margin: 6px 12px;
  }
}
</style>
