'use client'

import { useEffect, useRef, useState } from 'react'
import { Pencil } from 'lucide-react'

export function EditableText({
  value,
  onSave,
  placeholder = '— הוסף —',
  type = 'text',
  multiline = false,
}: {
  value: string
  onSave: (v: string) => void
  placeholder?: string
  type?: 'text' | 'tel' | 'email' | 'number'
  multiline?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setDraft(value)
  }, [value])

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      if ('select' in inputRef.current) inputRef.current.select()
    }
  }, [editing])

  const commit = () => {
    const next = draft.trim()
    if (next !== value) onSave(next)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(value)
    setEditing(false)
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={(el) => {
            inputRef.current = el
          }}
          className="ef-input ef-textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Escape') cancel()
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) commit()
          }}
          rows={4}
        />
      )
    }
    return (
      <input
        ref={(el) => {
          inputRef.current = el
        }}
        className="ef-input"
        type={type}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel()
          if (e.key === 'Enter') commit()
        }}
      />
    )
  }

  const display = value || ''
  return (
    <span
      className="ef-display"
      tabIndex={0}
      role="button"
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditing(true)
        }
      }}
    >
      {display || <span className="ef-placeholder">{placeholder}</span>}
      <Pencil size={11} className="ef-pencil" />
    </span>
  )
}

export function EditableNumber({
  value,
  onSave,
  prefix = '',
}: {
  value: number
  onSave: (n: number) => void
  prefix?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(value))
  const ref = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setDraft(String(value))
  }, [value])
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus()
      ref.current.select()
    }
  }, [editing])

  const commit = () => {
    const n = Number(draft) || 0
    if (n !== value) onSave(n)
    setEditing(false)
  }
  const cancel = () => {
    setDraft(String(value))
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={ref}
        className="ef-input"
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Escape') cancel()
          if (e.key === 'Enter') commit()
        }}
      />
    )
  }

  return (
    <span
      className="ef-display"
      tabIndex={0}
      role="button"
      onClick={() => setEditing(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setEditing(true)
        }
      }}
    >
      {prefix}
      {value.toLocaleString('en-US')}
      <Pencil size={11} className="ef-pencil" />
    </span>
  )
}
