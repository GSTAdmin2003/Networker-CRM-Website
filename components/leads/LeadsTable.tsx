'use client'
import { useState } from 'react'

export type Lead = {
  id: string
  phone: string | null
  company_name: string | null
  company_id: string | null
  rep_name: string | null
  rep_position: string | null
  rep_email: string | null
  industry: string | null
  industry_other: string | null
  lang: string | null
  created_at: string
  downloaded_at: string | null
}

type Filter = 'all' | 'new' | 'downloaded'

function buildCsv(leads: Lead[]): string {
  const header = 'phone,company_name,company_id,rep_name,rep_position,rep_email,industry,industry_other,lang,submitted_at'
  const escape = (v: string | null) => {
    if (v === null || v === '') return ''
    if (/[",\n\r]/.test(v)) return `"${v.replace(/"/g, '""')}"`
    return v
  }
  const rows = leads.map((l) =>
    [
      escape(l.phone),
      escape(l.company_name),
      escape(l.company_id),
      escape(l.rep_name),
      escape(l.rep_position),
      escape(l.rep_email),
      escape(l.industry),
      escape(l.industry_other),
      escape(l.lang),
      escape(l.created_at.slice(0, 10)),
    ].join(',')
  )
  return [header, ...rows].join('\r\n')
}

function triggerDownload(csv: string) {
  const date = new Date().toISOString().slice(0, 10)
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `leads-${date}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function formatIndustry(lead: Lead): string {
  if (!lead.industry) return ''
  if (lead.industry === 'other') return lead.industry_other ?? 'Other'
  return lead.industry.replace(/_/g, ' ')
}

function cell(v: string | null) {
  return v ? (
    <span>{v}</span>
  ) : (
    <span style={{ color: '#2a2a2a', fontStyle: 'italic', fontSize: 10 }}>—</span>
  )
}

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [downloading, setDownloading] = useState(false)
  const [patchError, setPatchError] = useState<string | null>(null)

  const totalAll = leads.length
  const totalNew = leads.filter((l) => l.downloaded_at === null).length
  const totalDownloaded = leads.filter((l) => l.downloaded_at !== null).length

  const filtered =
    filter === 'new'
      ? leads.filter((l) => l.downloaded_at === null)
      : filter === 'downloaded'
      ? leads.filter((l) => l.downloaded_at !== null)
      : leads

  const allSelected = filtered.length > 0 && filtered.every((l) => selected.has(l.id))
  const downloadEnabled = selected.size > 0

  function handleFilterChange(f: Filter) {
    setFilter(f)
    setSelected(new Set())
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((l) => l.id)))
    }
  }

  async function handleDownload() {
    if (!downloadEnabled || downloading) return
    const selectedIds = new Set(selected)
    const selectedLeads = leads.filter((l) => selectedIds.has(l.id))
    triggerDownload(buildCsv(selectedLeads))
    setDownloading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedLeads.map((l) => l.id) }),
      })
      if (res.ok) {
        setPatchError(null)
        const now = new Date().toISOString()
        setLeads((prev) =>
          prev.map((l) =>
            selectedIds.has(l.id) && l.downloaded_at === null
              ? { ...l, downloaded_at: now }
              : l
          )
        )
        setSelected(new Set())
      } else {
        setPatchError('Failed to record download — please reload and try again.')
      }
    } catch {
      setPatchError('Network error — please check your connection and try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div style={{ background: '#0d0d0d', minHeight: '100vh', color: '#e5e5e5', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Leads</span>
          <a href="/?edit=1" style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>← Back to site</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label style={{ fontSize: 11, color: '#555', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              style={{ accentColor: '#6ee7b7' }}
            />
            Select all
          </label>
          <button
            onClick={handleDownload}
            disabled={!downloadEnabled || downloading}
            style={{
              background: downloadEnabled ? '#6ee7b7' : '#1a1a1a',
              color: downloadEnabled ? '#000' : '#444',
              border: 'none', borderRadius: 6, padding: '7px 14px',
              fontSize: 11, fontWeight: 700, cursor: downloadEnabled ? 'pointer' : 'default',
            }}
          >
            {downloading ? 'Saving…' : '↓ Download CSV'}
          </button>
        </div>
      </div>
      {patchError && (
        <div style={{ fontSize: 10, color: '#f87171', marginTop: 4, textAlign: 'right', paddingRight: 20 }}>
          {patchError}
        </div>
      )}

      {/* Filter tabs */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', gap: 6 }}>
        {(['all', 'new', 'downloaded'] as Filter[]).map((f) => {
          const count = f === 'all' ? totalAll : f === 'new' ? totalNew : totalDownloaded
          const label = f === 'all' ? 'All' : f === 'new' ? 'New' : 'Downloaded'
          const active = filter === f
          return (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              style={{
                fontSize: 11, padding: '4px 10px', borderRadius: 4, cursor: 'pointer',
                background: active ? '#0d1a14' : '#111',
                border: `1px solid ${active ? '#1a3a26' : '#1e1e1e'}`,
                color: active ? '#6ee7b7' : '#555',
              }}
            >
              {label} <span style={{ color: active ? '#3a5a48' : '#3a3a3a', marginLeft: 3 }}>{count}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              <th style={thStyle}></th>
              <th style={thStyle}>Phone</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Rep name</th>
              <th style={thStyle}>Position</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Industry</th>
              <th style={{ ...thStyle, width: 96 }}>Submitted</th>
              <th style={{ ...thStyle, width: 72, textAlign: 'right' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ padding: '48px 20px', textAlign: 'center', color: '#333', fontSize: 12 }}>
                  No leads
                </td>
              </tr>
            )}
            {filtered.map((lead) => {
              const isSelected = selected.has(lead.id)
              const isDone = lead.downloaded_at !== null
              return (
                <tr
                  key={lead.id}
                  onClick={() => toggleRow(lead.id)}
                  style={{
                    opacity: isDone ? 0.5 : 1,
                    background: isSelected ? '#0a1a10' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <td style={{ ...tdStyle, width: 36 }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(lead.id)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ accentColor: '#6ee7b7' }}
                    />
                  </td>
                  <td style={{ ...tdStyle, color: '#e5e5e5', fontWeight: 500 }}>{cell(lead.phone)}</td>
                  <td style={tdStyle}>{cell(lead.company_name)}</td>
                  <td style={tdStyle}>{cell(lead.company_id)}</td>
                  <td style={tdStyle}>{cell(lead.rep_name)}</td>
                  <td style={tdStyle}>{cell(lead.rep_position)}</td>
                  <td style={tdStyle}>{cell(lead.rep_email)}</td>
                  <td style={tdStyle}>{cell(formatIndustry(lead) || null)}</td>
                  <td style={{ ...tdStyle, color: '#444', fontSize: 10 }}>{lead.created_at.slice(0, 10)}</td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    {isDone ? (
                      <span style={{ background: '#1a1a1a', color: '#444', fontSize: 9, padding: '2px 6px', borderRadius: 3 }}>↓ Done</span>
                    ) : (
                      <span style={{ background: '#0d1a14', color: '#6ee7b7', fontSize: 9, padding: '2px 6px', borderRadius: 3 }}>New</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 20px', borderTop: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#444' }}>
        <span>{selected.size > 0 ? `${selected.size} selected · ` : ''}{totalAll} total</span>
        <span>Sorted by newest first</span>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '8px 12px', color: '#444',
  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em',
  borderBottom: '1px solid #1a1a1a', background: '#0d0d0d',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '10px 12px', borderBottom: '1px solid #111', color: '#aaa', verticalAlign: 'middle',
}
