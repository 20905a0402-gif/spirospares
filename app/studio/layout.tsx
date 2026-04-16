import type {ReactNode} from 'react'

export const metadata = {
  title: 'Sanity Studio',
}

export default function StudioLayout({children}: {children: ReactNode}) {
  return <div className="min-h-screen bg-[#f8fafc] text-slate-900">{children}</div>
}
