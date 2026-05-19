'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  ChevronRight,
  FileText,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  Settings,
  Mail,
  Trash2,
  User as UserIcon,
} from 'lucide-react'
import {
  ACTIVITY_BY_CLIENT,
  ACTIVITY_DEFAULT,
  INVOICES_BY_CLIENT,
  INVOICES_DEFAULT,
  INVOICE_STATUS,
  ORDER_STATUS,
  ORDERS_BY_CLIENT,
  RECEIPTS_BY_CLIENT,
  RECEIPTS_DEFAULT,
  TAG_COLOR,
  TAG_HE,
} from '@/data/clientsMockData'
import {
  ClientsStoreProvider,
  useClientsStore,
  type StoredClient,
} from '@/hooks/useClientsStore'
import DesktopView from './DesktopView'
import NewClientDialog from './NewClientDialog'
import { EditableText, EditableNumber } from './EditableField'
import EditableTags from './EditableTags'
import './clients-mobile.css'
import './clients-desktop.css'
import './clients-shared.css'

type DetailTab = 'general' | 'invoices' | 'receipts' | 'orders' | 'notes' | 'activity'

const AV_COLORS = ['#7A5AE0', '#2A6FDB', '#1F8A5B', '#D97757', '#EAB308', '#E11D48', '#0EA5E9', '#A855F7']

function avatarColor(id: string) {
  let h = 0
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return AV_COLORS[h % AV_COLORS.length]
}

function fmtN(n: number) {
  return (n || 0).toLocaleString('en-US')
}

function balClass(b: number) {
  return b < 0 ? 'mob-bal-neg' : b > 0 ? 'mob-bal-pos' : 'mob-bal-zero'
}

function balText(b: number) {
  if (b === 0) return '₪0'
  return (b < 0 ? '−₪' : '+₪') + Math.abs(b).toLocaleString('en-US')
}

function Avatar({
  first,
  last,
  id,
  size = 40,
}: {
  first: string
  last: string
  id: string
  size?: number
}) {
  const initials = (first?.[0] || '') + (last?.[0] || '')
  return (
    <div
      className="mob-av"
      style={{ background: avatarColor(id), width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}

export default function ClientsPage() {
  return (
    <ClientsStoreProvider>
      <div className="show-desktop">
        <DesktopView />
      </div>
      <div className="show-mobile">
        <MobileApp />
      </div>
    </ClientsStoreProvider>
  )
}

function MobileApp() {
  const { clients } = useClientsStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [tab, setTab] = useState<DetailTab>('general')
  const [query, setQuery] = useState('')
  const [seg, setSeg] = useState<'all' | 'debtors' | 'new' | 'vip'>('all')
  const [showNew, setShowNew] = useState(false)

  const selected = useMemo(
    () => (selectedId ? clients.find((c) => c.id === selectedId) || null : null),
    [selectedId, clients]
  )

  return (
    <div className="mob-page" dir="rtl">
      <div className="mob-frame">
        {selected ? (
          <ClientDetail
            client={selected}
            tab={tab}
            onTabChange={setTab}
            onBack={() => {
              setSelectedId(null)
              setTab('general')
            }}
          />
        ) : (
          <ClientList
            clients={clients}
            query={query}
            onQuery={setQuery}
            seg={seg}
            onSeg={setSeg}
            onOpen={(id) => {
              setSelectedId(id)
              setTab('general')
            }}
            onNew={() => setShowNew(true)}
          />
        )}
      </div>
      <NewClientDialog
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={(id) => setSelectedId(id)}
      />
    </div>
  )
}

// ─── List screen ────────────────────────────────────────────────────────

function ClientList({
  clients,
  query,
  onQuery,
  seg,
  onSeg,
  onOpen,
  onNew,
}: {
  clients: StoredClient[]
  query: string
  onQuery: (q: string) => void
  seg: 'all' | 'debtors' | 'new' | 'vip'
  onSeg: (s: 'all' | 'debtors' | 'new' | 'vip') => void
  onOpen: (id: string) => void
  onNew: () => void
}) {
  const filtered = useMemo(() => {
    const q = query.trim()
    return clients.filter((c) => {
      if (seg === 'debtors' && c.balance >= 0) return false
      if (seg === 'new' && !c.tags.includes('new')) return false
      if (seg === 'vip' && !c.tags.includes('vip')) return false
      if (!q) return true
      const hay = `${c.firstName} ${c.lastName} ${c.phone} ${c.no} ${c.city}`
      return hay.includes(q)
    })
  }, [clients, query, seg])

  const groups = useMemo(() => {
    const acc: Record<string, StoredClient[]> = {}
    for (const c of filtered) {
      const letter = c.firstName[0] || '?'
      ;(acc[letter] ||= []).push(c)
    }
    return acc
  }, [filtered])

  const letters = useMemo(
    () => Object.keys(groups).sort((a, b) => a.localeCompare(b, 'he')),
    [groups]
  )

  return (
    <div className="mob">
      <div className="mob-top">
        <div className="mob-top-row">
          <span className="mob-bk">סינון</span>
          <span className="mob-title"></span>
          <button className="mob-act" aria-label="הוסף לקוח" onClick={onNew} type="button">
            <Plus size={18} />
          </button>
        </div>
        <div className="mob-h1">לקוחות</div>
        <div className="mob-search">
          <Search size={14} />
          <input
            placeholder="חיפוש לפי שם, טלפון, מס׳ לקוח…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
        <div className="mob-segs">
          <button className={seg === 'all' ? 'on' : ''} onClick={() => onSeg('all')}>
            הכול <span style={{ opacity: 0.5, fontWeight: 400 }}>· {clients.length}</span>
          </button>
          <button className={seg === 'debtors' ? 'on' : ''} onClick={() => onSeg('debtors')}>
            חייבים
          </button>
          <button className={seg === 'new' ? 'on' : ''} onClick={() => onSeg('new')}>
            חדשים
          </button>
          <button className={seg === 'vip' ? 'on' : ''} onClick={() => onSeg('vip')}>
            VIP
          </button>
        </div>
      </div>

      <div className="mob-scroll">
        {letters.map((l) => (
          <div key={l}>
            <div className="mob-sh">{l}</div>
            <div className="mob-list" style={{ paddingTop: 0 }}>
              {groups[l].map((c) => (
                <button key={c.id} className="mob-row" onClick={() => onOpen(c.id)} type="button">
                  <Avatar first={c.firstName} last={c.lastName} id={c.id} />
                  <div className="mob-row-i">
                    <div className="mob-row-n">
                      {c.firstName} {c.lastName}
                    </div>
                    <div className="mob-row-sub">
                      <span>{c.phone}</span>
                      <span className="dotsep" />
                      <span>{c.city}</span>
                    </div>
                  </div>
                  <div>
                    <div className={`mob-row-bal ${balClass(c.balance)}`}>{balText(c.balance)}</div>
                    <div className="mob-row-bal-sub">{c.lastPurchase.slice(0, 5)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {letters.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: '#8e8e93', fontSize: 14 }}>
            לא נמצאו לקוחות
          </div>
        )}
        <div style={{ height: 90 }} />
      </div>

      <button className="mob-fab" aria-label="הוסף לקוח חדש" onClick={onNew}>
        <Plus size={22} />
      </button>

      <div className="mob-bb">
        <button className="on">
          <UserIcon size={22} />
          לקוחות
        </button>
        <button>
          <FileText size={22} />
          חשבוניות
        </button>
        <button>
          <Package size={22} />
          הזמנות
        </button>
        <button>
          <Bell size={22} />
          התראות
        </button>
        <button>
          <Settings size={22} />
          עוד
        </button>
      </div>
    </div>
  )
}

// ─── Detail screen ──────────────────────────────────────────────────────

function ClientDetail({
  client,
  tab,
  onTabChange,
  onBack,
}: {
  client: StoredClient
  tab: DetailTab
  onTabChange: (t: DetailTab) => void
  onBack: () => void
}) {
  const { updateClient, deleteClient } = useClientsStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const invoices = INVOICES_BY_CLIENT[client.id] || INVOICES_DEFAULT
  const receipts = RECEIPTS_BY_CLIENT[client.id] || RECEIPTS_DEFAULT
  const orders = ORDERS_BY_CLIENT[client.id] || []
  const activity = ACTIVITY_BY_CLIENT[client.id] || ACTIVITY_DEFAULT

  const patch = (p: Partial<StoredClient>) => updateClient(client.id, p)

  return (
    <div className="mob">
      <div className="mob-top">
        <div className="mob-top-row">
          <button className="mob-bk" onClick={onBack} type="button">
            <ChevronRight size={16} /> לקוחות
          </button>
          <button
            className="mob-act"
            aria-label="מחק לקוח"
            onClick={() => setConfirmDelete(true)}
            type="button"
            style={{ color: '#d11a2a' }}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mob-scroll">
        <DetailHeader client={client} invoices={invoices} patch={patch} />
        <QuickActions client={client} />

        <div className="mob-tabs">
          <TabBtn on={tab === 'general'} onClick={() => onTabChange('general')}>
            כללי
          </TabBtn>
          <TabBtn on={tab === 'invoices'} onClick={() => onTabChange('invoices')}>
            חשבוניות <span className="mob-tab-c">{invoices.length}</span>
          </TabBtn>
          <TabBtn on={tab === 'receipts'} onClick={() => onTabChange('receipts')}>
            קבלות <span className="mob-tab-c">{receipts.length}</span>
          </TabBtn>
          <TabBtn on={tab === 'orders'} onClick={() => onTabChange('orders')}>
            הזמנות / תיקונים <span className="mob-tab-c">{orders.length}</span>
          </TabBtn>
          <TabBtn on={tab === 'notes'} onClick={() => onTabChange('notes')}>
            הערות
          </TabBtn>
          <TabBtn on={tab === 'activity'} onClick={() => onTabChange('activity')}>
            פעילות
          </TabBtn>
        </div>

        {tab === 'general' && <GeneralPane client={client} patch={patch} />}
        {tab === 'invoices' && <InvoicesPane invoices={invoices} />}
        {tab === 'receipts' && <ReceiptsPane receipts={receipts} />}
        {tab === 'orders' && <OrdersPane orders={orders} />}
        {tab === 'notes' && <NotesPane note={client.notes} onSave={(v) => patch({ notes: v })} />}
        {tab === 'activity' && <ActivityPane activity={activity} />}

        <div style={{ height: 30 }} />
      </div>

      {confirmDelete && (
        <div className="confirm-back" onClick={() => setConfirmDelete(false)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>למחוק את הלקוח?</h3>
            <p>
              {client.firstName} {client.lastName} (#{client.no}) — פעולה זו לא ניתנת לביטול.
            </p>
            <div className="confirm-actions">
              <button className="dlg-btn" onClick={() => setConfirmDelete(false)} type="button">
                ביטול
              </button>
              <button
                className="dlg-btn dlg-btn-danger"
                onClick={() => {
                  deleteClient(client.id)
                  onBack()
                }}
                type="button"
              >
                מחק
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TabBtn({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button className={`mob-tab ${on ? 'on' : ''}`} onClick={onClick} type="button">
      {children}
    </button>
  )
}

function DetailHeader({
  client,
  invoices,
  patch,
}: {
  client: StoredClient
  invoices: { amount: number; status: string }[]
  patch: (p: Partial<StoredClient>) => void
}) {
  const totalDue = invoices
    .filter((i) => i.status === 'open' || i.status === 'overdue')
    .reduce((s, i) => s + i.amount, 0)
  const totalPurchases = client.totalPurchases ?? 0

  return (
    <div className="mob-dh">
      <div className="mob-dh-row">
        <Avatar first={client.firstName} last={client.lastName} id={client.id} size={54} />
        <div className="mob-dh-i">
          <div className="mob-dh-n">
            {client.firstName} {client.lastName}
          </div>
          <div className="mob-dh-c">
            {client.companyName} · #{client.no}
          </div>
        </div>
      </div>
      <div className="mob-dh-tags">
        <EditableTags
          tags={client.tags}
          onSave={(tags) => patch({ tags })}
          size="sm"
        />
      </div>
      <div className="mob-kpis">
        <div className="mob-kpi">
          <div className="mob-kpi-l">יתרה</div>
          <div className={`mob-kpi-v ${balClass(client.balance)}`}>{balText(client.balance)}</div>
          <div className="mob-kpi-s">לתשלום</div>
        </div>
        <div className="mob-kpi">
          <div className="mob-kpi-l">חשבוניות פתוחות</div>
          <div className="mob-kpi-v">{client.activeInvoices}</div>
          <div className="mob-kpi-s">סה״כ ₪{fmtN(Math.abs(totalDue))}</div>
        </div>
        <div className="mob-kpi">
          <div className="mob-kpi-l">הזמנות פעילות</div>
          <div className="mob-kpi-v">{client.openOrders}</div>
          <div className="mob-kpi-s">אחרונה {client.lastPurchase}</div>
        </div>
        <div className="mob-kpi">
          <div className="mob-kpi-l">סה״כ רכישות</div>
          <div className="mob-kpi-v">₪{fmtN(totalPurchases)}</div>
          <div className="mob-kpi-s">מאז {client.joinDate.slice(6)}</div>
        </div>
      </div>
    </div>
  )
}

function QuickActions({ client }: { client: StoredClient }) {
  return (
    <div className="mob-qa">
      <a href={`tel:${client.phone}`} style={{ textDecoration: 'none' }}>
        <button>
          <Phone size={18} />
          חיוג
        </button>
      </a>
      <a href={`mailto:${client.email}`} style={{ textDecoration: 'none' }}>
        <button>
          <Mail size={18} />
          אימייל
        </button>
      </a>
      <button>
        <RefreshCw size={18} />
        עדכון
      </button>
      <button>
        <Plus size={18} />
        הזמנה
      </button>
    </div>
  )
}

// ─── Panes ──────────────────────────────────────────────────────────────

function GeneralPane({
  client,
  patch,
}: {
  client: StoredClient
  patch: (p: Partial<StoredClient>) => void
}) {
  return (
    <>
      <div className="mob-sh">פרטי קשר</div>
      <div className="mob-card">
        <Field label="טלפון">
          <EditableText value={client.phone} onSave={(v) => patch({ phone: v })} type="tel" />
        </Field>
        <Field label="אימייל">
          <EditableText value={client.email} onSave={(v) => patch({ email: v })} type="email" />
        </Field>
        <Field label="כתובת">
          <EditableText value={client.address} onSave={(v) => patch({ address: v })} />
        </Field>
        <Field label="תאריך לידה">
          <EditableText
            value={client.birthDate || ''}
            onSave={(v) => patch({ birthDate: v })}
          />
        </Field>
      </div>

      <div className="mob-sh">בן/בת זוג</div>
      <div className="mob-card">
        <Field label="שם">
          <EditableText
            value={client.spouseName || ''}
            onSave={(v) => patch({ spouseName: v })}
          />
        </Field>
        <Field label="טלפון">
          <EditableText
            value={client.spousePhone || ''}
            onSave={(v) => patch({ spousePhone: v })}
            type="tel"
          />
        </Field>
        <Field label="תאריך לידה">
          <EditableText
            value={client.spouseBirth || ''}
            onSave={(v) => patch({ spouseBirth: v })}
          />
        </Field>
        <Field label="יום נישואין">
          <EditableText
            value={client.anniversary || ''}
            onSave={(v) => patch({ anniversary: v })}
          />
        </Field>
      </div>

      <div className="mob-sh">פיננסי</div>
      <div className="mob-card">
        <Field label="ח.פ / עוסק">
          <EditableText value={client.taxId} onSave={(v) => patch({ taxId: v })} />
        </Field>
        <Field label="תנאי תשלום">
          <EditableText value={client.terms} onSave={(v) => patch({ terms: v })} />
        </Field>
        <Field label="מסגרת אשראי">
          <EditableNumber
            value={client.creditLimit}
            onSave={(n) => patch({ creditLimit: n })}
            prefix="₪"
          />
        </Field>
        <Field label="מנהל לקוח">
          <EditableText value={client.owner} onSave={(v) => patch({ owner: v })} />
        </Field>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mob-fld">
      <span className="mob-fld-l">{label}</span>
      <span className="mob-fld-v">{children}</span>
    </div>
  )
}

function InvoicesPane({ invoices }: { invoices: typeof INVOICES_DEFAULT }) {
  const open = invoices.filter((r) => r.status === 'open' || r.status === 'overdue')
  const totalOpen = open.reduce((s, r) => s + r.amount, 0)

  return (
    <>
      <div className="mob-kpis" style={{ margin: '0 14px 12px' }}>
        <div className="mob-kpi">
          <div className="mob-kpi-l">פתוחות</div>
          <div className="mob-kpi-v">{open.length}</div>
        </div>
        <div className="mob-kpi">
          <div className="mob-kpi-l">לתשלום</div>
          <div className="mob-kpi-v">₪{fmtN(Math.abs(totalOpen))}</div>
        </div>
      </div>

      <div className="mob-sh">חשבוניות</div>
      <div className="mob-doc-list">
        {invoices.map((r) => (
          <div key={r.id} className="mob-doc">
            <div style={{ minWidth: 0 }}>
              <div className="mob-doc-id">
                {r.kind === 'credit' ? 'זיכוי' : 'חשבונית'} {r.id}
              </div>
              <div className="mob-doc-meta">
                <span>הופקה {r.date}</span>
                <span className="dotsep" />
                <span>{r.ref}</span>
              </div>
              <div className="mob-doc-actions">
                <span className={`mob-pill mob-pill-${INVOICE_STATUS[r.status].dot}`}>
                  <span className="dot" />
                  {INVOICE_STATUS[r.status].he}
                </span>
                <button className="primary">
                  <Send size={11} />
                  שלח
                </button>
                <button>
                  <Printer size={11} />
                  הדפס
                </button>
              </div>
            </div>
            <div className={`mob-doc-amt ${r.amount < 0 ? 'mob-bal-pos' : ''}`}>
              {r.amount < 0 ? '+' : ''}₪{fmtN(Math.abs(r.amount))}
            </div>
          </div>
        ))}
        {invoices.length === 0 && (
          <div className="empty-state">אין חשבוניות להצגה</div>
        )}
      </div>

      <button className="mob-cta primary" type="button">
        <Plus size={14} /> חשבונית חדשה
      </button>
    </>
  )
}

function ReceiptsPane({ receipts }: { receipts: typeof RECEIPTS_DEFAULT }) {
  return (
    <>
      <div className="mob-sh">קבלות</div>
      <div className="mob-doc-list">
        {receipts.map((r) => (
          <div key={r.id} className="mob-doc">
            <div style={{ minWidth: 0 }}>
              <div className="mob-doc-id">קבלה {r.id}</div>
              <div className="mob-doc-meta">
                <span>{r.date}</span>
                <span className="dotsep" />
                <span>{r.method}</span>
                <span className="dotsep" />
                <span>{r.ref}</span>
              </div>
              <div className="mob-doc-actions">
                <button>
                  <Printer size={11} />
                  הדפס
                </button>
              </div>
            </div>
            <div className="mob-doc-amt">₪{fmtN(r.amount)}</div>
          </div>
        ))}
        {receipts.length === 0 && (
          <div className="empty-state">אין קבלות להצגה</div>
        )}
      </div>
    </>
  )
}

function OrdersPane({ orders }: { orders: NonNullable<typeof ORDERS_BY_CLIENT[string]> }) {
  const openRows = orders.filter((r) => r.status !== 'delivered' && r.status !== 'cancelled')
  return (
    <>
      <div className="mob-sh">פתוח כעת ({openRows.length})</div>
      <div className="mob-doc-list">
        {orders.map((r) => (
          <div key={r.id} className="mob-doc">
            <div style={{ minWidth: 0 }}>
              <div className="mob-doc-id">
                {r.kind === 'repair' ? '🔧 ' : '📦 '}
                {r.id} · {r.kind === 'repair' ? 'תיקון' : 'הזמנה'}
              </div>
              <div
                style={{ fontSize: 13, color: '#3c3c43', marginTop: 4, lineHeight: 1.4 }}
              >
                {r.desc}
              </div>
              <div className="mob-doc-meta">
                <span>נפתח {r.date}</span>
                <span className="dotsep" />
                <span>יעד {r.due}</span>
              </div>
              <div className="mob-doc-actions">
                <span className={`mob-pill mob-pill-${ORDER_STATUS[r.status].dot}`}>
                  <span className="dot" />
                  {ORDER_STATUS[r.status].he}
                </span>
                <button>
                  <RefreshCw size={11} />
                  עדכן
                </button>
                <button>
                  <Printer size={11} />
                  הדפס
                </button>
              </div>
            </div>
            <div className="mob-doc-amt">₪{fmtN(r.amount)}</div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="empty-state">אין הזמנות / תיקונים להצגה</div>
        )}
      </div>

      <button className="mob-cta" type="button">
        <Plus size={14} /> פתח הזמנה / תיקון חדשים
      </button>
    </>
  )
}

function NotesPane({ note, onSave }: { note: string; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState(note)
  const dirty = draft !== note
  return (
    <>
      <div className="mob-sh">הערות</div>
      <div className="mob-notes">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="כתוב הערה…"
        />
      </div>
      {dirty && (
        <button
          className="mob-cta primary"
          type="button"
          onClick={() => onSave(draft)}
        >
          שמור הערה
        </button>
      )}
    </>
  )
}

function ActivityPane({ activity }: { activity: { date: string; who: string; what: string }[] }) {
  return (
    <>
      <div className="mob-sh">פעילות אחרונה</div>
      <div className="mob-feed">
        {activity.map((a, i) => (
          <div key={i} className="mob-feed-i">
            <div className="mob-feed-dot" />
            <div style={{ minWidth: 0 }}>
              <div className="mob-feed-w">{a.what}</div>
              <div className="mob-feed-d">
                {a.date} · {a.who}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
