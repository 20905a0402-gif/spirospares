'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { quickLinks } from '@/lib/data'

export default function NavStrip() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const lastToggleAt = useRef(0)

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    setIsVisible(true)
    lastScrollY.current = window.scrollY
    lastToggleAt.current = 0
  }, [pathname])

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      const previousY = lastScrollY.current
      const delta = currentY - previousY
      const now = Date.now()
      const canToggle = now - lastToggleAt.current > 150

      if (Math.abs(delta) < 5) {
        lastScrollY.current = currentY
        return
      }

      if (delta > 0 && canToggle && currentY > 100) {
        setIsVisible(false)
        lastToggleAt.current = now
      } else if (delta < 0 && canToggle) {
        setIsVisible(true)
        lastToggleAt.current = now
      }

      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed left-0 right-0 top-[73px] z-[60] bg-[#00D4FF] shadow-md transition-transform duration-300 ease-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container-shell">
        <ul className="flex items-center justify-center gap-1 overflow-x-auto py-2 text-sm font-semibold [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {quickLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative inline-flex items-center px-4 py-1.5 rounded-full transition-all duration-300 ease-out whitespace-nowrap ${
                  isLinkActive(link.href)
                    ? 'bg-white text-[#0080A0] shadow-sm'
                    : 'text-white hover:bg-white/20 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
