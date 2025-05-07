'use client'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { SiDiscord, SiGithub, SiX } from 'react-icons/si'

const externalLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/justin-cose',
    icon: <SiX className="mr-2 h-4 w-4" />
  },
  {
    name: 'X',
    href: 'https://x.com/justinrcose',
    icon: <SiDiscord className="mr-2 h-4 w-4" />
  },
  {
    name: 'Archer AI',
    href: 'https://askarcher.ai',
    icon: <SiGithub className="mr-2 h-4 w-4" />
  }
]

export function ExternalLinkItems() {
  return (
    <>
      {externalLinks.map(link => (
        <DropdownMenuItem key={link.name} asChild>
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            {/* {link.icon} */}
            <span>{link.name}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  )
}
