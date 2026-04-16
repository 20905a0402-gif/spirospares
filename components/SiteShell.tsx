'use client'

import {ReactNode} from 'react'
import {usePathname} from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingActions from '@/components/FloatingActions'

interface SiteShellProps {
  children: ReactNode
}

export default function SiteShell({children}: SiteShellProps) {
  const pathname = usePathname()
  const isStudioRoute = pathname?.startsWith('/studio')

  if (isStudioRoute) {
    return <div className="min-h-screen bg-[#f8fafc]">{children}</div>
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header />
      <main className="pb-20">{children}</main>
      <Footer />
      <FloatingActions />
    </div>
  )
}