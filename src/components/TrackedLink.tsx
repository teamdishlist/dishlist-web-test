'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TrackedLinkProps {
    href: string
    children: React.ReactNode
    className?: string
    style?: React.CSSProperties
    fromPage?: string
}

export default function TrackedLink({ href, children, className, style, fromPage }: TrackedLinkProps) {
    const pathname = usePathname()

    const handleClick = () => {
        if (fromPage && typeof window !== 'undefined') {
            sessionStorage.setItem('fromPage', fromPage)
        }
    }

    return (
        <Link
            href={href}
            className={className}
            style={style}
            onClick={handleClick}
        >
            {children}
        </Link>
    )
}

