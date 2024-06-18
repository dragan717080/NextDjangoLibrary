'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAllBooksStore } from '@/app/store/zustandStore'

const Books = () => {
  const router = useRouter();
  const { allBooks } = useAllBooksStore();

  return (
    <div className='lg:px-22 px-7 py-12 sm:px-10 md:px-14 2xl:px-28 text-black'>
      Books
    </div>
  )
}

export default Books;
