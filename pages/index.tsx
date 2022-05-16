import type { NextPage } from 'next'
import Link from 'next/link'
import { Layout } from '../layouts'
import { trpc } from '../utils/trpc'

const Home: NextPage = () => {
  return (
    <Layout>
      <main>
        <h1 className="text-xl font-bold underline">Hello world!</h1>
      </main>
    </Layout>
  )
}

export default Home
