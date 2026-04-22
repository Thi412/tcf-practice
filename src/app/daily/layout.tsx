import BottomNav from '@/components/BottomNav'

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      <BottomNav />
    </>
  )
}
