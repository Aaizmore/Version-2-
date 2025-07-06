import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/auth/user-nav"
import { createClient } from "@/lib/supabase/server"
import { PenTool, GraduationCap, Home, BookOpen } from "lucide-react"

export async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 sticky top-0 z-50 professional-shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 font-bold text-xl group">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="gradient-text">Lakambini XI</span>
                <div className="text-xs text-muted-foreground font-normal">Archives</div>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="#stories"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <BookOpen className="h-4 w-4" />
                Stories
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="hover:bg-primary/5 hover:text-primary transition-all duration-200"
                >
                  <Link href="/write" className="flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">Write</span>
                  </Link>
                </Button>
                <UserNav user={user} />
              </>
            ) : (
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <Link href="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
