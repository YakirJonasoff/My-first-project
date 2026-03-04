'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { FilterState, DateRange, Platform } from '@/types'
import { PRESET_RANGES } from '@/lib/dataUtils'

interface FilterContextValue {
  filters: FilterState
  setDateRange: (range: DateRange) => void
  setPreset: (preset: keyof typeof PRESET_RANGES) => void
  setCompareTo: (mode: FilterState['compareTo']) => void
  togglePlatform: (platform: Platform) => void
  setPlatforms: (platforms: Platform[]) => void
  setCampaignStatus: (status: FilterState['campaignStatus']) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

const defaultFilters: FilterState = {
  dateRange: PRESET_RANGES.last30(),
  compareTo: 'previous_period',
  platforms: [],
  campaignStatus: 'all',
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  function setDateRange(range: DateRange) {
    setFilters(f => ({ ...f, dateRange: range }))
  }

  function setPreset(preset: keyof typeof PRESET_RANGES) {
    setFilters(f => ({ ...f, dateRange: PRESET_RANGES[preset]() }))
  }

  function setCompareTo(mode: FilterState['compareTo']) {
    setFilters(f => ({ ...f, compareTo: mode }))
  }

  function togglePlatform(platform: Platform) {
    setFilters(f => ({
      ...f,
      platforms: f.platforms.includes(platform)
        ? f.platforms.filter(p => p !== platform)
        : [...f.platforms, platform],
    }))
  }

  function setPlatforms(platforms: Platform[]) {
    setFilters(f => ({ ...f, platforms }))
  }

  function setCampaignStatus(status: FilterState['campaignStatus']) {
    setFilters(f => ({ ...f, campaignStatus: status }))
  }

  return (
    <FilterContext.Provider
      value={{ filters, setDateRange, setPreset, setCompareTo, togglePlatform, setPlatforms, setCampaignStatus }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used within FilterProvider')
  return ctx
}
