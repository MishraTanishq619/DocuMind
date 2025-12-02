"use client"
import dynamic from 'next/dynamic'
import React from 'react'

const ChatApp = dynamic(() => import('./components/ChatApp'), { ssr: false })

// export const metadata = {
//   title: 'Chat - DocuMind',
// }

export default function Page() {
  return (
        <ChatApp />
  )
}
