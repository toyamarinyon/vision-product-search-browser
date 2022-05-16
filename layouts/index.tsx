import Link from 'next/link'
import { useEffect, useState } from 'react'
import cn from 'classnames'

interface LayoutProps {
  children: React.ReactNode
}
export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-y-hidden">
      <header className="px-8 py-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">
          Vision Product Search Data Browser
        </h1>
      </header>
      <main className="flex flex-1 h-full">
        <div className="flex w-full">
          <div className="border-r pt-8">
            <Navigation />
          </div>
          <div className="h-full overflow-y-scroll w-full">{children}</div>
        </div>
      </main>
    </div>
  )
}

function Navigation() {
  return (
    <ul className="w-48">
      <li>
        <NavigationLink linkTo="/products" label="Products" />
      </li>
      <li>
        <NavigationLink linkTo="/productSets" label="Product Sets" />
      </li>
    </ul>
  )
}

interface NavigationLinkProps {
  linkTo: string
  label: string
}
function NavigationLink({ linkTo, label }: NavigationLinkProps) {
  const [currentPage, setCurrentPage] = useState(false)
  useEffect(() => {
    setCurrentPage(location.pathname == linkTo)
  }, [linkTo])
  ;('hover:bg-gray-200')
  return (
    <Link href={linkTo}>
      <a
        className={cn('hover:bg-gray-200 pl-8 py-2 block', {
          'bg-indigo-100': currentPage,
          'text-indigo-600': currentPage,
          'text-gray-600': !currentPage,
        })}
      >
        {label}
      </a>
    </Link>
  )
}
