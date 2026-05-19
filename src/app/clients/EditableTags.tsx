'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { TAG_COLOR, TAG_HE, type TagKey } from '@/data/clientsMockData'

const TAG_ORDER: TagKey[] = ['vip', 'wholesale', 'retail', 'new', 'recurring', 'late', 'online', 'b2b']

export default function EditableTags({
  tags,
  onSave,
  size = 'sm',
}: {
  tags: TagKey[]
  onSave: (next: TagKey[]) => void
  size?: 'sm' | 'md'
}) {
  const [open, setOpen] = useState(false)
  const popRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const remove = (t: TagKey) => onSave(tags.filter((x) => x !== t))
  const add = (t: TagKey) => {
    if (tags.includes(t)) return
    onSave([...tags, t])
  }

  const available = TAG_ORDER.filter((t) => !tags.includes(t))
  const cls = size === 'md' ? 'tag' : 'mob-tag'

  return (
    <div className="et-wrap" ref={popRef}>
      {tags.map((t) => (
        <span key={t} className={`${cls} ${cls}-${TAG_COLOR[t]} et-chip`}>
          {TAG_HE[t]}
          <button type="button" className="et-x" onClick={() => remove(t)} aria-label="הסר תיוג">
            <X size={10} />
          </button>
        </span>
      ))}
      {available.length > 0 && (
        <button type="button" className="et-add" onClick={() => setOpen((o) => !o)}>
          <Plus size={11} /> תיוג
        </button>
      )}
      {open && available.length > 0 && (
        <div className="et-pop">
          {available.map((t) => (
            <button
              key={t}
              type="button"
              className="et-pop-i"
              onClick={() => {
                add(t)
                setOpen(false)
              }}
            >
              <span className={`tag tag-${TAG_COLOR[t]}`}>{TAG_HE[t]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
