import BookForm from '@/components/admin/forms/Bookform'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <Button className='back-btn'>
        <Link href='/admin/books'>Go Back</Link>
      </Button>

      <section className='w-full max-w-2xl'>
        <BookForm />
      </section>
    </>
  )
}

export default page