'use client'

import dynamic from 'next/dynamic'
import config from '@/sanity.config'

const Studio = dynamic(() => import('sanity').then((mod) => mod.Studio), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-slate-900">
      Loading Sanity Studio...
    </div>
  ),
})

export default function StudioPage() {
  return <Studio config={config} />
}
