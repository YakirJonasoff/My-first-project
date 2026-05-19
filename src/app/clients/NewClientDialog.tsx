'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { TAG_HE, type TagKey } from '@/data/clientsMockData'
import { useClientsStore, type NewClientInput } from '@/hooks/useClientsStore'

const TAG_ORDER: TagKey[] = ['vip', 'wholesale', 'retail', 'new', 'recurring', 'late', 'online', 'b2b']
const TERMS_OPTIONS = ['מיידי', 'שוטף + 15', 'שוטף + 30', 'שוטף + 60']

export default function NewClientDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  onCreated?: (id: string) => void
}) {
  const { addClient } = useClientsStore()
  const [form, setForm] = useState<NewClientInput>(blank())
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setForm(blank())
      setErrors({})
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const update = <K extends keyof NewClientInput>(k: K, v: NewClientInput[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const toggleTag = (t: TagKey) => {
    setForm((f) => {
      const tags = new Set(f.tags || [])
      if (tags.has(t)) tags.delete(t)
      else tags.add(t)
      return { ...f, tags: Array.from(tags) }
    })
  }

  const submit = () => {
    const errs: Record<string, string> = {}
    if (!form.firstName.trim()) errs.firstName = 'שדה חובה'
    if (!form.lastName.trim()) errs.lastName = 'שדה חובה'
    if (!form.phone.trim()) errs.phone = 'שדה חובה'
    setErrors(errs)
    if (Object.keys(errs).length) return
    const created = addClient(form)
    onCreated?.(created.id)
    onClose()
  }

  return (
    <div className="dlg-backdrop" dir="rtl" onClick={onClose}>
      <div className="dlg" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="dlg-head">
          <h2>לקוח חדש</h2>
          <button className="dlg-x" onClick={onClose} aria-label="סגור" type="button">
            <X size={18} />
          </button>
        </div>

        <div className="dlg-body">
          <div className="dlg-grid">
            <Field label="שם פרטי *" error={errors.firstName}>
              <input
                autoFocus
                value={form.firstName}
                onChange={(e) => update('firstName', e.target.value)}
              />
            </Field>
            <Field label="שם משפחה *" error={errors.lastName}>
              <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} />
            </Field>
            <Field label="טלפון *" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="050-0000000"
              />
            </Field>
            <Field label="אימייל">
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => update('email', e.target.value)}
              />
            </Field>
            <Field label="שם חברה">
              <input
                value={form.companyName || ''}
                onChange={(e) => update('companyName', e.target.value)}
              />
            </Field>
            <Field label="עיר">
              <input value={form.city || ''} onChange={(e) => update('city', e.target.value)} />
            </Field>
            <Field label="כתובת" wide>
              <input
                value={form.address || ''}
                onChange={(e) => update('address', e.target.value)}
              />
            </Field>
            <Field label="ח.פ / עוסק">
              <input value={form.taxId || ''} onChange={(e) => update('taxId', e.target.value)} />
            </Field>
            <Field label="תנאי תשלום">
              <select
                value={form.terms || 'מיידי'}
                onChange={(e) => update('terms', e.target.value)}
              >
                {TERMS_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="מסגרת אשראי (₪)">
              <input
                type="number"
                min={0}
                value={form.creditLimit ?? 0}
                onChange={(e) => update('creditLimit', Number(e.target.value) || 0)}
              />
            </Field>
            <Field label="מנהל לקוח">
              <input value={form.owner || ''} onChange={(e) => update('owner', e.target.value)} />
            </Field>
            <Field label="תיוגים" wide>
              <div className="dlg-tags">
                {TAG_ORDER.map((t) => {
                  const on = (form.tags || []).includes(t)
                  return (
                    <button
                      key={t}
                      type="button"
                      className={`dlg-tag${on ? ' on' : ''}`}
                      onClick={() => toggleTag(t)}
                    >
                      {TAG_HE[t]}
                    </button>
                  )
                })}
              </div>
            </Field>
            <Field label="הערות" wide>
              <textarea
                rows={3}
                value={form.notes || ''}
                onChange={(e) => update('notes', e.target.value)}
              />
            </Field>
          </div>
        </div>

        <div className="dlg-foot">
          <button className="dlg-btn" onClick={onClose} type="button">
            ביטול
          </button>
          <button className="dlg-btn dlg-btn-primary" onClick={submit} type="button">
            הוסף לקוח
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  wide,
  children,
}: {
  label: string
  error?: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <label className={`dlg-fld${wide ? ' dlg-fld-wide' : ''}`}>
      <span className="dlg-fld-l">{label}</span>
      {children}
      {error && <span className="dlg-fld-e">{error}</span>}
    </label>
  )
}

function blank(): NewClientInput {
  return {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    companyName: '',
    city: '',
    address: '',
    taxId: '',
    terms: 'מיידי',
    creditLimit: 0,
    owner: '',
    notes: '',
    tags: [],
  }
}
