import './globals.css'

export const metadata = {
  title: 'AI Quiz Generator',
  description: 'Transform your study notes into interactive quizzes powered by Claude AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
