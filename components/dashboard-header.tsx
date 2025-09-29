"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, User, LayoutGrid, Files, Calendar, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = async () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="sr-only">Dashboard</span>
        </Link>
      </div>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/dashboard"
          className={`transition-colors hover:text-foreground ${pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"}`}
        >
          Dashboard
        </Link>
        <Link
          href="/tools/ai-general/research-summarizer"
          className={`transition-colors hover:text-foreground ${pathname.startsWith("/tools/ai-general") ? "text-foreground" : "text-muted-foreground"}`}
        >
          AI General
        </Link>
        <Link
          href="/tools/cloud-dev/api-docs"
          className={`transition-colors hover:text-foreground ${pathname.startsWith("/tools/cloud-dev") ? "text-foreground" : "text-muted-foreground"}`}
        >
          Cloud Dev
        </Link>
        <Link
          href="/tools/marketing/ad-copy"
          className={`transition-colors hover:text-foreground ${pathname.startsWith("/tools/marketing") ? "text-foreground" : "text-muted-foreground"}`}
        >
          Marketing
        </Link>
        <Link
          href="/tools/productivity-design/meeting-notes"
          className={`transition-colors hover:text-foreground ${pathname.startsWith("/tools/productivity-design") ? "text-foreground" : "text-muted-foreground"}`}
        >
          Productivity & Design
        </Link>
      </nav>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tools..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {user?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 border shadow-lg" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Account</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.username || "Guest"}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>Settings</DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
