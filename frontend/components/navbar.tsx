import Link from "next/link"

export function Navbar() {
  return (
    <header className="bg-green-400 text-white p-4 rounded-3xl flex items-center justify-between">
      <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
        Fruity Study
      </Link>
      <div className="flex gap-4">
        <Link href="/team" className="hover:opacity-80 transition-opacity">
          팀
        </Link>
        <Link href="/login" className="hover:opacity-80 transition-opacity">
          로그인
        </Link>
      </div>
    </header>
  )
}
