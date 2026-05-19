'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  CLIENTS,
  PERSONAL,
  type Client,
  type Personal,
  type TagKey,
} from '@/data/clientsMockData'

const STORAGE_KEY = 'clients_store_v1'

export type StoredClient = Client & Partial<Personal>

type Store = {
  clients: StoredClient[]
}

function seedStore(): Store {
  return {
    clients: CLIENTS.map((c) => ({ ...c, ...(PERSONAL[c.id] || {}) })),
  }
}

function loadFromStorage(): Store | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Store
    if (!parsed || !Array.isArray(parsed.clients)) return null
    return parsed
  } catch {
    return null
  }
}

export type NewClientInput = {
  firstName: string
  lastName: string
  phone: string
  email?: string
  companyName?: string
  city?: string
  address?: string
  taxId?: string
  terms?: string
  creditLimit?: number
  owner?: string
  notes?: string
  tags?: TagKey[]
}

type ContextValue = {
  clients: StoredClient[]
  loaded: boolean
  addClient: (c: NewClientInput) => StoredClient
  updateClient: (id: string, patch: Partial<StoredClient>) => void
  deleteClient: (id: string) => void
  reset: () => void
}

const Ctx = createContext<ContextValue | null>(null)

export function ClientsStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(seedStore)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const fromStorage = loadFromStorage()
    if (fromStorage) setStore(fromStorage)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      /* quota / private mode — ignore */
    }
  }, [store, loaded])

  const addClient = useCallback((input: NewClientInput) => {
    let created!: StoredClient
    setStore((s) => {
      const maxNo = s.clients.reduce((m, x) => Math.max(m, x.no), 1000)
      const no = maxNo + 1
      const id = `CL-${no}`
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      const todayStr = `${dd}.${mm}.${yyyy}`
      created = {
        id,
        no,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        phone: input.phone.trim(),
        email: (input.email || '').trim(),
        companyName: (input.companyName || '').trim(),
        city: (input.city || '').trim(),
        address: (input.address || '').trim(),
        taxId: (input.taxId || '').trim(),
        terms: input.terms || 'מיידי',
        creditLimit: input.creditLimit ?? 0,
        owner: (input.owner || '').trim(),
        notes: (input.notes || '').trim(),
        tags: input.tags && input.tags.length ? input.tags : ['new'],
        balance: 0,
        activeInvoices: 0,
        openOrders: 0,
        lastPurchase: todayStr,
        joinDate: todayStr,
        status: 'active',
      }
      return { ...s, clients: [created, ...s.clients] }
    })
    return created
  }, [])

  const updateClient = useCallback((id: string, patch: Partial<StoredClient>) => {
    setStore((s) => ({
      ...s,
      clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }))
  }, [])

  const deleteClient = useCallback((id: string) => {
    setStore((s) => ({ ...s, clients: s.clients.filter((c) => c.id !== id) }))
  }, [])

  const reset = useCallback(() => {
    setStore(seedStore())
  }, [])

  const value = useMemo(
    () => ({ clients: store.clients, loaded, addClient, updateClient, deleteClient, reset }),
    [store.clients, loaded, addClient, updateClient, deleteClient, reset]
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useClientsStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useClientsStore must be used inside <ClientsStoreProvider>')
  return v
}
