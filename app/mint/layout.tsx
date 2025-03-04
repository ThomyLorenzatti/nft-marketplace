export default function MintLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen pt-32">
      {children}
    </main>
  )
}