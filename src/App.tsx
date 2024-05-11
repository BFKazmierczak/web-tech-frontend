import { useState } from 'react'
import HomePage from './pages/HomePage'
import { Navbar } from './components/Navbar'

function App() {
  const [page, setPage] = useState<string>('/')

  return (
    <div className=" flex flex-col h-[100%] w-full">
      <Navbar />

      {page === '/' && <HomePage />}
    </div>
  )
}

export default App
