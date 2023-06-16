import { ModalAdd } from '@/components/ModalAdd'
import './globals.css'

export const metadata = {
  title: 'Trello Clone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='bg-[#F5F6F8]'>
        {children}
        <ModalAdd />
      </body>
    </html>
  )
}
