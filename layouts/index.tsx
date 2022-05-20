import Link from 'next/link'
import { useEffect, useState } from 'react'
import cn from 'classnames'

interface LayoutProps {
  children: React.ReactNode
}
export function Layout({ children }: LayoutProps) {
  const [productName, setProductName] = useState('')
  return (
    <div className="">
      <header className="px-8 py-4 border-b fixed top-0 left-0 right-0 bg-white">
        <div className="flex space-x-8">
          <h1 className="text-xl font-bold text-gray-800">
            Vision Product Search Data Browser
          </h1>
          <form
            className="relative flex items-center"
            onSubmit={(e) => {
              e.preventDefault()
              if (productName == '') {
                alert('Please enter a product name')
                return
              }
              window.location.href = `/products/${productName}`
            }}
          >
            <input
              id="direct"
              className="px-2 pr-8 py-1 rounded text-sm space-x-2 border w-72 bg-gray-50"
              placeholder="Fill in product name and open it"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <button className="absolute right-2">
              <div className="border rounded px-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </button>
          </form>
        </div>
      </header>
      <main className="flex flex-1 pt-20 px-8">
        <Navigation />
        <div className="w-full pl-48">{children}</div>
      </main>
    </div>
  )
}

function Navigation() {
  return (
    <ul className="w-48 fixed border-l border-gray-200 space-y-3">
      <li style={{ marginLeft: -1 }}>
        <NavigationLink linkTo="/products" label="Products" />
      </li>
      <li style={{ marginLeft: -1 }}>
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
    setCurrentPage(location.pathname.startsWith(linkTo))
  }, [linkTo])
  return (
    <Link href={linkTo}>
      <a
        className={cn('hover:border-gray-500 pl-4 py-1 block text-sm', {
          'hover:border-gray-500': !currentPage,
          'hover:border-indigo-600': currentPage,
          'border-l-2': currentPage,
          'border-l': !currentPage,
          'border-indigo-600': currentPage,
          'font-bold': currentPage,
          'border-gray-200': !currentPage,
          'text-indigo-600': currentPage,
          'text-gray-600': !currentPage,
        })}
      >
        {label}
      </a>
    </Link>
  )
}
