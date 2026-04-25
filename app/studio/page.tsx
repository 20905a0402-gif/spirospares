'use client'

import { useEffect } from 'react'

export default function StudioPage() {
  useEffect(() => {
    window.location.href = '/studio/index.html'
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-slate-400">Loading Sanity Studio...</p>
    </div>
  )
}
