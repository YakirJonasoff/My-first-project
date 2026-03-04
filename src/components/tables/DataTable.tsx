'use client'

import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import clsx from 'clsx'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Column<T = any> {
  key: keyof T | string
  label: string
  sortable?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, row: T) => React.ReactNode
  align?: 'left' | 'right' | 'center'
  width?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface DataTableProps<T = any> {
  title?: string
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  defaultSortKey?: keyof T | string
  defaultSortDir?: 'asc' | 'desc'
  pageSize?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DataTable<T = any>({
  title,
  data,
  columns,
  searchable = true,
  searchKeys,
  defaultSortKey,
  defaultSortDir = 'desc',
  pageSize = 10,
}: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(defaultSortKey as string ?? null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>(defaultSortDir)
  const [page, setPage] = useState(1)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return data
    const q = search.toLowerCase()
    const keys = searchKeys || columns.map(c => c.key as keyof T)
    return data.filter(row =>
      keys.some(k => String(row[k] ?? '').toLowerCase().includes(q))
    )
  }, [data, search, searchKeys, columns])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      const av = a[sortKey as keyof T]
      const bv = b[sortKey as keyof T]
      const cmp = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av ?? '').localeCompare(String(bv ?? ''))
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.ceil(sorted.length / pageSize)
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="card p-0">
      {/* Header */}
      {(title || searchable) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-4">
          {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
          {searchable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search..."
                className="bg-[#1e2740] border border-[#2d3a5c] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500/50 w-52"
              />
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#1e2740]">
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className={clsx(
                    'px-5 py-3 font-medium text-slate-400 whitespace-nowrap',
                    col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                    col.sortable && 'cursor-pointer hover:text-white select-none',
                    col.width
                  )}
                  onClick={col.sortable ? () => handleSort(col.key as string) : undefined}
                >
                  <div className={clsx('flex items-center gap-1', col.align === 'right' && 'justify-end', col.align === 'center' && 'justify-center')}>
                    {col.label}
                    {col.sortable && (
                      sortKey === col.key
                        ? sortDir === 'asc'
                          ? <ChevronUp className="w-3 h-3 text-brand-400" />
                          : <ChevronDown className="w-3 h-3 text-brand-400" />
                        : <ChevronsUpDown className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-slate-500">
                  No data found
                </td>
              </tr>
            ) : (
              paged.map((row, i) => (
                <tr key={i} className="border-b border-[#1a2035] table-row-hover">
                  {columns.map(col => (
                    <td
                      key={String(col.key)}
                      className={clsx(
                        'px-5 py-3 text-slate-300',
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : ''
                      )}
                    >
                      {col.render
                        ? col.render(row[col.key as keyof T], row)
                        : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1e2740]">
          <span className="text-xs text-slate-500">
            {sorted.length} results — page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={clsx(
                    'w-7 h-7 rounded text-xs',
                    p === page
                      ? 'bg-brand-500/20 text-brand-400 font-medium'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded text-xs text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
