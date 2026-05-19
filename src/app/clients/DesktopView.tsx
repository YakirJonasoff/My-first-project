'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  ChevronLeft,
  Download,
  FileText,
  Filter,
  Home,
  Inbox,
  Mail,
  MoreHorizontal,
  Package,
  Phone,
  Plus,
  Printer,
  RefreshCw,
  Search,
  Send,
  Settings,
  ArrowUpDown,
  Trash2,
  User as UserIcon,
} from 'lucide-react'
import {
  ACTIVITY_BY_CLIENT,
  ACTIVITY_DEFAULT,
  INVOICES_BY_CLIENT,
  INVOICES_DEFAULT,
  INVOICE_STATUS,
  ORDERS_BY_CLIENT,
  ORDER_STATUS,
  RECEIPTS_BY_CLIENT,
  RECEIPTS_DEFAULT,
  TAG_COLOR,
  TAG_HE,
} from '@/data/clientsMockData'
import { useClientsStore, type StoredClient } from '@/hooks/useClientsStore'
import NewClientDialog from './NewClientDialog'
import { EditableText, EditableNumber } from './EditableField'
import EditableTags from './EditableTags'

type View = 'all' | 'late' | 'new' | 'vip'
type DetailTab = 'general' | 'invoices' | 'receipts' | 'orders' | 'notes' | 'activity'

const fmt = (n: number) => new Intl.NumberFormat('he-IL').format(n)
const moneyClass = (n: number) => (n > 0 ? 'pos' : n < 0 ? 'neg' : 'zero')
const moneyText = (n: number) =>
  n === 0 ? '₪0' : n < 0 ? '−₪' + fmt(Math.abs(n)) : '+₪' + fmt(n)
const fullName = (c: StoredClient) => `${c.firstName} ${c.lastName}`.trim()

function avatarHue(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360
  return h
}

function Avatar({
  first,
  last,
  id,
  size = 28,
}: {
  first: string
  last: string
  id: string
  size?: number
}) {
  const hue = avatarHue(id)
  return (
    <span
      className="avatar"
      style={{
        width: size,
        height: size,
        background: `oklch(0.92 0.04 ${hue})`,
        color: `oklch(0.40 0.10 ${hue})`,
        fontSize: Math.round(size * 0.42),
      }}
    >
      {(first?.[0] || '') + (last?.[0] || '')}
    </span>
  )
}

function Tag({ slug }: { slug: keyof typeof TAG_HE }) {
  return <span className={`tag tag-${TAG_COLOR[slug]}`}>{TAG_HE[slug]}</span>
}

function Pill({ kind, children }: { kind: 'g' | 'b' | 'y' | 'r' | 'n'; children: React.ReactNode }) {
  return (
    <span className={`pill pill-${kind}`}>
      <span className={`dot dot-${kind}`} />
      {children}
    </span>
  )
}

export default function DesktopView() {
  const { clients } = useClientsStore()
  const [openId, setOpenId] = useState<string | null>(null)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const [view, setView] = useState<View>('all')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState<DetailTab>('general')
  const [showNew, setShowNew] = useState(false)

  const filtered = useMemo(() => {
    let r = clients
    if (view === 'late') r = r.filter((c) => c.balance < 0 && c.tags.includes('late'))
    if (view === 'new') r = r.filter((c) => c.tags.includes('new'))
    if (view === 'vip') r = r.filter((c) => c.tags.includes('vip'))
    if (q.trim()) {
      const s = q.trim().toLowerCase()
      r = r.filter(
        (c) =>
          c.firstName.toLowerCase().includes(s) ||
          c.lastName.toLowerCase().includes(s) ||
          (c.companyName || '').toLowerCase().includes(s) ||
          c.email.toLowerCase().includes(s) ||
          c.phone.includes(s) ||
          String(c.no).includes(s)
      )
    }
    return r
  }, [clients, view, q])

  // Keep previewId valid as the list changes.
  const effectivePreviewId = useMemo(() => {
    if (previewId && filtered.some((c) => c.id === previewId)) return previewId
    return filtered[0]?.id ?? null
  }, [previewId, filtered])

  const toggleSel = (id: string) => {
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((s) =>
      s.size === filtered.length ? new Set() : new Set(filtered.map((c) => c.id))
    )
  }

  const openClient = openId ? clients.find((c) => c.id === openId) : null

  return (
    <div className="dt-root">
      <div className="shell">
        <Sidebar total={clients.length} clients={clients} />
        <div className="shell-main">
          <TopBar
            inDetail={!!openClient}
            clientName={openClient ? fullName(openClient) : ''}
            onBack={() => setOpenId(null)}
          />
          <div className="shell-work">
            {!openClient ? (
              <>
                <Toolbar
                  q={q}
                  setQ={setQ}
                  view={view}
                  setView={setView}
                  total={clients.length}
                  selectedCount={selected.size}
                  onNew={() => setShowNew(true)}
                />
                <div className="split">
                  <ClientsTable
                    clients={filtered}
                    previewId={effectivePreviewId}
                    onSelect={(id) => setPreviewId(id)}
                    onOpen={(id) => {
                      setOpenId(id)
                      setTab('general')
                    }}
                    selected={selected}
                    toggleSel={toggleSel}
                    toggleAll={toggleAll}
                  />
                  <ClientPreview
                    id={effectivePreviewId}
                    onOpen={(id) => {
                      setOpenId(id)
                      setTab('general')
                    }}
                  />
                </div>
                <div className="tbl-foot">
                  <div>
                    {filtered.length} לקוחות
                    {selected.size > 0 ? ` · ${selected.size} נבחרו` : ''}
                  </div>
                </div>
              </>
            ) : (
              <ClientDetail
                client={openClient}
                tab={tab}
                onTabChange={setTab}
                onDeleted={() => setOpenId(null)}
              />
            )}
          </div>
        </div>
      </div>

      <NewClientDialog
        open={showNew}
        onClose={() => setShowNew(false)}
        onCreated={(id) => {
          setPreviewId(id)
          setShowNew(false)
        }}
      />
    </div>
  )
}

// ─── Sidebar ────────────────────────────────────────────────────────────

function Sidebar({ total, clients }: { total: number; clients: StoredClient[] }) {
  const items = [
    { icon: Home, label: 'דשבורד' },
    { icon: UserIcon, label: 'לקוחות', count: total, active: true },
    { icon: FileText, label: 'חשבוניות', count: 18 },
    { icon: Package, label: 'מוצרים' },
    { icon: Inbox, label: 'תיבת דואר', count: 3 },
  ]
  const lists: Array<{ color: string; label: string; count: number }> = [
    { color: 'amber', label: 'VIP', count: clients.filter((c) => c.tags.includes('vip')).length },
    {
      color: 'rose',
      label: 'מאחרים בתשלום',
      count: clients.filter((c) => c.tags.includes('late')).length,
    },
    {
      color: 'emerald',
      label: 'חדשים החודש',
      count: clients.filter((c) => c.tags.includes('new')).length,
    },
    {
      color: 'violet',
      label: 'סיטונאים',
      count: clients.filter((c) => c.tags.includes('wholesale')).length,
    },
  ]
  return (
    <aside className="sb">
      <div className="sb-brand">
        <span className="sb-brand-mark">ז</span>
        <div>
          <div className="sb-brand-name">זהבה — ניהול</div>
          <div className="sb-brand-sub">workspace · 4 משתמשים</div>
        </div>
      </div>
      <nav className="sb-nav">
        {items.map((it) => {
          const Icn = it.icon
          return (
            <button key={it.label} className={`sb-item${it.active ? ' on' : ''}`} type="button">
              <span className="sb-icn">
                <Icn size={16} />
              </span>
              <span className="sb-lbl">{it.label}</span>
              {it.count != null && <span className="sb-count">{it.count}</span>}
            </button>
          )
        })}
      </nav>
      <div className="sb-sect">
        <div className="sb-sect-h">
          <span>רשימות</span>
          <Plus size={12} />
        </div>
        {lists.map((l) => (
          <button key={l.label} className="sb-item" type="button">
            <span className={`sb-bullet bullet-${l.color}`} />
            <span className="sb-lbl">{l.label}</span>
            <span className="sb-count">{l.count}</span>
          </button>
        ))}
      </div>
      <div className="sb-foot">
        <div className="sb-user">
          <Avatar first="נ" last="ל" id="user-1" size={26} />
          <div className="sb-user-i">
            <div className="sb-user-n">נועה לוי</div>
            <div className="sb-user-r">בעלים</div>
          </div>
          <button className="sb-user-x" type="button">
            <Settings size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

// ─── TopBar ─────────────────────────────────────────────────────────────

function TopBar({
  inDetail,
  clientName,
  onBack,
}: {
  inDetail: boolean
  clientName: string
  onBack: () => void
}) {
  return (
    <header className="tb">
      <div className="tb-bc">
        {inDetail && (
          <>
            <button className="tb-back" onClick={onBack} type="button">
              <ArrowRight size={14} />
              <span>חזרה</span>
            </button>
            <span className="tb-bc-sep">/</span>
          </>
        )}
        <span className="tb-bc-l">לקוחות</span>
        {inDetail && (
          <>
            <span className="tb-bc-sep">/</span>
            <span className="tb-bc-cur">{clientName}</span>
          </>
        )}
      </div>
      <div className="tb-search">
        <Search size={14} />
        <input placeholder="חיפוש לקוחות, חשבוניות, קבלות…" />
        <kbd className="kbd">⌘ K</kbd>
      </div>
      <div className="tb-r">
        <button className="tb-icnbtn" title="התראות" type="button">
          <Bell size={16} />
          <span className="tb-dot" />
        </button>
        <button className="tb-icnbtn" title="עזרה" type="button">
          ?
        </button>
        <Avatar first="נ" last="ל" id="user-1" size={26} />
      </div>
    </header>
  )
}

// ─── Toolbar ────────────────────────────────────────────────────────────

function Toolbar({
  q,
  setQ,
  view,
  setView,
  total,
  selectedCount,
  onNew,
}: {
  q: string
  setQ: (s: string) => void
  view: View
  setView: (v: View) => void
  total: number
  selectedCount: number
  onNew: () => void
}) {
  return (
    <div className="tlb">
      <div className="seg">
        <button className={view === 'all' ? 'on' : ''} onClick={() => setView('all')} type="button">
          הכול <span className="seg-c">{total}</span>
        </button>
        <button className={view === 'late' ? 'on' : ''} onClick={() => setView('late')} type="button">
          חייבים
        </button>
        <button className={view === 'new' ? 'on' : ''} onClick={() => setView('new')} type="button">
          חדשים
        </button>
        <button className={view === 'vip' ? 'on' : ''} onClick={() => setView('vip')} type="button">
          VIP
        </button>
      </div>
      <div className="tlb-r">
        <div className="tlb-search">
          <Search size={13} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש בעמוד הזה…" />
        </div>
        <button className="btn" type="button">
          <Filter size={14} />
          סינון
        </button>
        <button className="btn" type="button">
          <ArrowUpDown size={14} />
          מיון
        </button>
        <span className="tlb-sep" />
        <button className="btn" type="button">
          <Download size={14} />
          ייצוא
        </button>
        <button className="btn btn-icn" type="button" title="הדפס">
          <Printer size={14} />
        </button>
        <span className="tlb-sep" />
        <button className="btn btn-primary" type="button" onClick={onNew}>
          <Plus size={14} />
          לקוח חדש
        </button>
      </div>
    </div>
  )
}

// ─── ClientsTable ───────────────────────────────────────────────────────

function ClientsTable({
  clients,
  previewId,
  onSelect,
  onOpen,
  selected,
  toggleSel,
  toggleAll,
}: {
  clients: StoredClient[]
  previewId: string | null
  onSelect: (id: string) => void
  onOpen: (id: string) => void
  selected: Set<string>
  toggleSel: (id: string) => void
  toggleAll: () => void
}) {
  const allSel = clients.length > 0 && clients.every((c) => selected.has(c.id))
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <colgroup>
          <col style={{ width: 30 }} />
          <col style={{ width: 70 }} />
          <col style={{ width: 130 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 110 }} />
          <col style={{ width: 170 }} />
          <col style={{ width: 90 }} />
          <col style={{ width: 100 }} />
        </colgroup>
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={allSel} onChange={toggleAll} />
            </th>
            <th>מס׳</th>
            <th>שם פרטי</th>
            <th>שם משפחה</th>
            <th>טלפון</th>
            <th>תיוגים</th>
            <th>יתרה</th>
            <th>רכישה אחרונה</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr
              key={c.id}
              data-id={c.id}
              className={previewId === c.id ? 'sel' : ''}
              onClick={() => onSelect(c.id)}
              onDoubleClick={() => onOpen(c.id)}
            >
              <td onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleSel(c.id)} />
              </td>
              <td className="num">{c.no}</td>
              <td>
                <div className="cell-client">
                  <Avatar first={c.firstName} last={c.lastName} id={c.id} size={22} />
                  <span className="cell-client-n">{c.firstName}</span>
                </div>
              </td>
              <td>
                <span className="cell-client-n">{c.lastName}</span>
              </td>
              <td className="num">{c.phone}</td>
              <td>
                <div className="cell-tags">
                  {c.tags.slice(0, 2).map((t) => (
                    <Tag key={t} slug={t} />
                  ))}
                  {c.tags.length > 2 && <span className="tag tag-more">+{c.tags.length - 2}</span>}
                </div>
              </td>
              <td className={`num bal-${moneyClass(c.balance)}`}>{moneyText(c.balance)}</td>
              <td className="num">{c.lastPurchase}</td>
            </tr>
          ))}
          {clients.length === 0 && (
            <tr>
              <td colSpan={8} style={{ textAlign: 'center', padding: 30, color: 'var(--t-3)' }}>
                לא נמצאו לקוחות תואמים — נסה לשנות סינון או חיפוש
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─── Preview pane ───────────────────────────────────────────────────────

function ClientPreview({ id, onOpen }: { id: string | null; onOpen: (id: string) => void }) {
  const { clients } = useClientsStore()
  if (!id) {
    return (
      <div className="prev empty">
        <UserIcon size={22} />
        <div>בחר לקוח לתצוגה מקדימה</div>
        <span style={{ fontSize: 11 }}>או לחץ פעמיים לפתיחת הכרטיס המלא</span>
      </div>
    )
  }
  const c = clients.find((x) => x.id === id)
  if (!c) return null
  const invs = INVOICES_BY_CLIENT[id] || INVOICES_DEFAULT
  const recs = RECEIPTS_BY_CLIENT[id] || RECEIPTS_DEFAULT

  return (
    <div className="prev">
      <div className="prev-h">
        <Avatar first={c.firstName} last={c.lastName} id={c.id} size={42} />
        <div className="prev-h-i">
          <div className="prev-h-n">{fullName(c)}</div>
          <div className="prev-h-c">
            {c.no} · {c.companyName}
          </div>
          <div className="prev-h-tags">
            {c.tags.map((t) => (
              <Tag key={t} slug={t} />
            ))}
          </div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => onOpen(id)} type="button">
          פתח כרטיס
          <ChevronLeft size={13} />
        </button>
      </div>
      <div className="prev-stats">
        <div>
          <span className="prev-stat-l">יתרה</span>
          <span className={`num bal-${moneyClass(c.balance)}`}>{moneyText(c.balance)}</span>
        </div>
        <div>
          <span className="prev-stat-l">חשבוניות פתוחות</span>
          <span className="num">{c.activeInvoices}</span>
        </div>
        <div>
          <span className="prev-stat-l">הזמנות פתוחות</span>
          <span className="num">{c.openOrders}</span>
        </div>
        <div>
          <span className="prev-stat-l">מסגרת אשראי</span>
          <span className="num">₪{fmt(c.creditLimit)}</span>
        </div>
      </div>
      <div className="prev-sect">
        <div className="prev-sect-h">
          <span>חשבוניות אחרונות</span>
          <a onClick={() => onOpen(id)}>הצג הכול</a>
        </div>
        <table className="mini-tbl">
          <tbody>
            {invs.slice(0, 3).map((iv) => (
              <tr key={iv.id}>
                <td className="num">{iv.id}</td>
                <td className="num">{iv.date}</td>
                <td>
                  <Pill kind={INVOICE_STATUS[iv.status].dot}>{INVOICE_STATUS[iv.status].he}</Pill>
                </td>
                <td className="end num">₪{fmt(Math.abs(iv.amount))}</td>
              </tr>
            ))}
            {invs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--t-3)', textAlign: 'center' }}>
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="prev-sect">
        <div className="prev-sect-h">
          <span>קבלות אחרונות</span>
          <a onClick={() => onOpen(id)}>הצג הכול</a>
        </div>
        <table className="mini-tbl">
          <tbody>
            {recs.slice(0, 3).map((r) => (
              <tr key={r.id}>
                <td className="num">{r.id}</td>
                <td className="num">{r.date}</td>
                <td style={{ color: 'var(--t-3)' }}>{r.method}</td>
                <td className="end num">₪{fmt(r.amount)}</td>
              </tr>
            ))}
            {recs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--t-3)', textAlign: 'center' }}>
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Detail screen ──────────────────────────────────────────────────────

function ClientDetail({
  client,
  tab,
  onTabChange,
  onDeleted,
}: {
  client: StoredClient
  tab: DetailTab
  onTabChange: (t: DetailTab) => void
  onDeleted: () => void
}) {
  const { updateClient, deleteClient } = useClientsStore()
  const [confirmDelete, setConfirmDelete] = useState(false)
  const invs = INVOICES_BY_CLIENT[client.id] || INVOICES_DEFAULT
  const recs = RECEIPTS_BY_CLIENT[client.id] || RECEIPTS_DEFAULT
  const orders = ORDERS_BY_CLIENT[client.id] || []
  const activity = ACTIVITY_BY_CLIENT[client.id] || ACTIVITY_DEFAULT
  const totalDue = invs
    .filter((i) => i.status === 'open' || i.status === 'overdue')
    .reduce((s, i) => s + i.amount, 0)

  const patch = (p: Partial<StoredClient>) => updateClient(client.id, p)

  return (
    <div className="detail">
      <div className="dh">
        <div className="dh-l">
          <Avatar first={client.firstName} last={client.lastName} id={client.id} size={52} />
          <div>
            <div className="dh-row1">
              <h1>{fullName(client)}</h1>
              <span className="dh-id">#{client.no}</span>
            </div>
            <div className="dh-row2">
              <span>
                <Phone size={13} /> {client.phone}
              </span>
              <span>
                <Mail size={13} /> {client.email}
              </span>
              <span style={{ color: 'var(--t-3)' }}>{client.address}</span>
            </div>
            <div className="dh-row3">
              <EditableTags
                tags={client.tags}
                onSave={(tags) => patch({ tags })}
                size="md"
              />
            </div>
          </div>
        </div>
        <div className="dh-kpis">
          <div className="kpi">
            <div className="kpi-l">יתרה</div>
            <div className={`kpi-v kpi-${moneyClass(client.balance)}`}>{moneyText(client.balance)}</div>
            <div className="kpi-s">לתשלום</div>
          </div>
          <div className="kpi">
            <div className="kpi-l">חשב׳ פתוחות</div>
            <div className="kpi-v">{client.activeInvoices}</div>
            <div className="kpi-s">₪{fmt(Math.abs(totalDue))}</div>
          </div>
          <div className="kpi">
            <div className="kpi-l">הזמנות פעילות</div>
            <div className="kpi-v">{client.openOrders}</div>
            <div className="kpi-s">אחרונה {client.lastPurchase}</div>
          </div>
          <div className="kpi">
            <div className="kpi-l">סה״כ רכישות</div>
            <div className="kpi-v">₪{fmt(client.totalPurchases ?? 0)}</div>
            <div className="kpi-s">מאז {client.joinDate.slice(6)}</div>
          </div>
        </div>
        <div className="dh-act">
          <button
            className="btn"
            type="button"
            onClick={() => setConfirmDelete(true)}
            style={{ color: 'var(--r)', borderColor: 'var(--border)' }}
            title="מחק לקוח"
          >
            <Trash2 size={13} /> מחק
          </button>
          <button className="btn" type="button" title="עוד">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      <div className="dt-tabs">
        <DtTab on={tab === 'general'} onClick={() => onTabChange('general')}>
          כללי
        </DtTab>
        <DtTab on={tab === 'invoices'} onClick={() => onTabChange('invoices')}>
          חשבוניות <span className="dt-tab-c">{invs.length}</span>
        </DtTab>
        <DtTab on={tab === 'receipts'} onClick={() => onTabChange('receipts')}>
          קבלות <span className="dt-tab-c">{recs.length}</span>
        </DtTab>
        <DtTab on={tab === 'orders'} onClick={() => onTabChange('orders')}>
          הזמנות / תיקונים <span className="dt-tab-c">{orders.length}</span>
        </DtTab>
        <DtTab on={tab === 'notes'} onClick={() => onTabChange('notes')}>
          הערות
        </DtTab>
        <DtTab on={tab === 'activity'} onClick={() => onTabChange('activity')}>
          פעילות
        </DtTab>
      </div>

      <div className="dt-body">
        {tab === 'general' && <GeneralTab client={client} patch={patch} />}
        {tab === 'invoices' && <InvoicesTab invs={invs} />}
        {tab === 'receipts' && <ReceiptsTab recs={recs} />}
        {tab === 'orders' && <OrdersTab orders={orders} />}
        {tab === 'notes' && <NotesTab note={client.notes} onSave={(v) => patch({ notes: v })} />}
        {tab === 'activity' && <ActivityTab activity={activity} />}
      </div>

      {confirmDelete && (
        <div className="confirm-back" onClick={() => setConfirmDelete(false)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <h3>למחוק את הלקוח?</h3>
            <p>
              {fullName(client)} (#{client.no}) — פעולה זו לא ניתנת לביטול.
            </p>
            <div className="confirm-actions">
              <button className="dlg-btn" onClick={() => setConfirmDelete(false)} type="button">
                ביטול
              </button>
              <button
                className="dlg-btn dlg-btn-danger"
                onClick={() => {
                  deleteClient(client.id)
                  setConfirmDelete(false)
                  onDeleted()
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

function DtTab({
  on,
  onClick,
  children,
}: {
  on: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button className={`dt-tab${on ? ' on' : ''}`} onClick={onClick} type="button">
      {children}
    </button>
  )
}

function GeneralTab({
  client,
  patch,
}: {
  client: StoredClient
  patch: (p: Partial<StoredClient>) => void
}) {
  return (
    <div className="tab-g-grid">
      <div className="tab-g-card">
        <div className="tab-g-h">פרטי קשר</div>
        <Fld l="טלפון">
          <EditableText value={client.phone} onSave={(v) => patch({ phone: v })} type="tel" />
        </Fld>
        <Fld l="אימייל">
          <EditableText value={client.email} onSave={(v) => patch({ email: v })} type="email" />
        </Fld>
        <Fld l="כתובת">
          <EditableText value={client.address} onSave={(v) => patch({ address: v })} />
        </Fld>
        <Fld l="תאריך לידה">
          <EditableText value={client.birthDate || ''} onSave={(v) => patch({ birthDate: v })} />
        </Fld>
      </div>

      <div className="tab-g-card">
        <div className="tab-g-h">בן/בת זוג</div>
        <Fld l="שם">
          <EditableText value={client.spouseName || ''} onSave={(v) => patch({ spouseName: v })} />
        </Fld>
        <Fld l="טלפון">
          <EditableText
            value={client.spousePhone || ''}
            onSave={(v) => patch({ spousePhone: v })}
            type="tel"
          />
        </Fld>
        <Fld l="תאריך לידה">
          <EditableText
            value={client.spouseBirth || ''}
            onSave={(v) => patch({ spouseBirth: v })}
          />
        </Fld>
        <Fld l="יום נישואין">
          <EditableText
            value={client.anniversary || ''}
            onSave={(v) => patch({ anniversary: v })}
          />
        </Fld>
      </div>

      <div className="tab-g-card">
        <div className="tab-g-h">פיננסי</div>
        <Fld l="ח.פ / עוסק">
          <EditableText value={client.taxId} onSave={(v) => patch({ taxId: v })} />
        </Fld>
        <Fld l="תנאי תשלום">
          <EditableText value={client.terms} onSave={(v) => patch({ terms: v })} />
        </Fld>
        <Fld l="מסגרת אשראי">
          <EditableNumber
            value={client.creditLimit}
            onSave={(n) => patch({ creditLimit: n })}
            prefix="₪"
          />
        </Fld>
        <Fld l="מנהל לקוח">
          <EditableText value={client.owner} onSave={(v) => patch({ owner: v })} />
        </Fld>
      </div>

      <div className="tab-g-card">
        <div className="tab-g-h">פרטי חברה</div>
        <Fld l="שם חברה">
          <EditableText
            value={client.companyName}
            onSave={(v) => patch({ companyName: v })}
          />
        </Fld>
        <Fld l="עיר">
          <EditableText value={client.city} onSave={(v) => patch({ city: v })} />
        </Fld>
        <Fld l="מקור הגעה">
          <EditableText value={client.source || ''} onSave={(v) => patch({ source: v })} />
        </Fld>
        <Fld l="הצטרף">{client.joinDate}</Fld>
      </div>
    </div>
  )
}

function Fld({ l, children }: { l: string; children: React.ReactNode }) {
  return (
    <div className="fld">
      <span className="fld-l">{l}</span>
      <span className="fld-v">{children}</span>
    </div>
  )
}

function InvoicesTab({ invs }: { invs: typeof INVOICES_DEFAULT }) {
  const open = invs.filter((r) => r.status === 'open' || r.status === 'overdue')
  const totalOpen = open.reduce((s, r) => s + r.amount, 0)
  const totalPaid = invs.filter((r) => r.status === 'paid').reduce((s, r) => s + r.amount, 0)
  return (
    <>
      <div className="tab-i-bar">
        <div className="tab-i-stats">
          <div>
            <span className="tab-i-l">פתוחות</span>
            <span className="tab-i-v">{open.length}</span>
          </div>
          <div>
            <span className="tab-i-l">לתשלום</span>
            <span className="tab-i-v">₪{fmt(Math.abs(totalOpen))}</span>
          </div>
          <div>
            <span className="tab-i-l">שולמו (תקופה)</span>
            <span className="tab-i-v">₪{fmt(totalPaid)}</span>
          </div>
        </div>
        <div className="tab-i-act">
          <button className="btn" type="button">
            <Download size={13} /> ייצוא
          </button>
          <button className="btn btn-primary" type="button">
            <Plus size={13} /> חשבונית חדשה
          </button>
        </div>
      </div>
      <div className="tab-i-tbl">
        <table className="tbl">
          <thead>
            <tr>
              <th>מס׳</th>
              <th>הופקה</th>
              <th>תוקף</th>
              <th>סטטוס</th>
              <th>הפניה</th>
              <th>סכום</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {invs.map((r) => (
              <tr key={r.id}>
                <td className="num">{r.id}</td>
                <td className="num">{r.date}</td>
                <td className="num">{r.due}</td>
                <td>
                  <Pill kind={INVOICE_STATUS[r.status].dot}>{INVOICE_STATUS[r.status].he}</Pill>
                </td>
                <td>{r.ref}</td>
                <td className={`num bal-${r.amount < 0 ? 'pos' : 'zero'}`}>
                  {r.amount < 0 ? '+' : ''}₪{fmt(Math.abs(r.amount))}
                </td>
                <td>
                  <button className="btn btn-sm btn-primary" type="button">
                    <Send size={11} /> שלח
                  </button>{' '}
                  <button className="btn btn-sm" type="button">
                    <Printer size={11} /> הדפס
                  </button>
                </td>
              </tr>
            ))}
            {invs.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 20, color: 'var(--t-3)' }}>
                  אין חשבוניות
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function ReceiptsTab({ recs }: { recs: typeof RECEIPTS_DEFAULT }) {
  return (
    <div className="tab-i-tbl">
      <table className="tbl">
        <thead>
          <tr>
            <th>מס׳</th>
            <th>תאריך</th>
            <th>אמצעי תשלום</th>
            <th>הפניה</th>
            <th>סכום</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {recs.map((r) => (
            <tr key={r.id}>
              <td className="num">{r.id}</td>
              <td className="num">{r.date}</td>
              <td>{r.method}</td>
              <td>{r.ref}</td>
              <td className="num">₪{fmt(r.amount)}</td>
              <td>
                <button className="btn btn-sm" type="button">
                  <Printer size={11} /> הדפס
                </button>
              </td>
            </tr>
          ))}
          {recs.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: 'var(--t-3)' }}>
                אין קבלות
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function OrdersTab({ orders }: { orders: NonNullable<typeof ORDERS_BY_CLIENT[string]> }) {
  return (
    <>
      <div className="tab-i-bar">
        <div className="tab-i-stats">
          <div>
            <span className="tab-i-l">פתוחות</span>
            <span className="tab-i-v">
              {orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length}
            </span>
          </div>
          <div>
            <span className="tab-i-l">סה״כ הזמנות</span>
            <span className="tab-i-v">{orders.length}</span>
          </div>
        </div>
        <div className="tab-i-act">
          <button className="btn btn-primary" type="button">
            <Plus size={13} /> פתח הזמנה / תיקון
          </button>
        </div>
      </div>
      <div className="tab-i-tbl">
        <table className="tbl">
          <thead>
            <tr>
              <th>מס׳</th>
              <th>סוג</th>
              <th>תיאור</th>
              <th>נפתח</th>
              <th>יעד</th>
              <th>סטטוס</th>
              <th>סכום</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((r) => (
              <tr key={r.id}>
                <td className="num">{r.id}</td>
                <td>{r.kind === 'repair' ? '🔧 תיקון' : '📦 הזמנה'}</td>
                <td>{r.desc}</td>
                <td className="num">{r.date}</td>
                <td className="num">{r.due}</td>
                <td>
                  <Pill kind={ORDER_STATUS[r.status].dot}>{ORDER_STATUS[r.status].he}</Pill>
                </td>
                <td className="num">₪{fmt(r.amount)}</td>
                <td>
                  <button className="btn btn-sm" type="button">
                    <RefreshCw size={11} /> עדכן
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 20, color: 'var(--t-3)' }}>
                  אין הזמנות / תיקונים
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}

function NotesTab({ note, onSave }: { note: string; onSave: (v: string) => void }) {
  const [draft, setDraft] = useState(note)
  const dirty = draft !== note
  return (
    <div className="tab-notes">
      <div className="tab-g-h">הערות פנימיות</div>
      <textarea
        className="tab-notes-ta"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="כתוב הערה…"
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10, gap: 6 }}>
        <button
          className="btn"
          type="button"
          disabled={!dirty}
          onClick={() => setDraft(note)}
        >
          ביטול
        </button>
        <button
          className="btn btn-primary"
          type="button"
          disabled={!dirty}
          onClick={() => onSave(draft)}
        >
          שמור
        </button>
      </div>
    </div>
  )
}

function ActivityTab({ activity }: { activity: { date: string; who: string; what: string }[] }) {
  return (
    <div className="tab-feed">
      {activity.map((a, i) => (
        <div key={i} className="feed-item">
          <div className="feed-dot" />
          <div style={{ minWidth: 0 }}>
            <div className="feed-w">{a.what}</div>
            <div className="feed-d">
              {a.date} · {a.who}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
