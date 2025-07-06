import Link from "next/link"
import { GraduationCap, Heart, Users } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-t border-primary/10 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg gradient-text">Lakambini XI Archives</h3>
                <p className="text-sm text-muted-foreground">Grade 11 Digital Stories</p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
              Preserving memories and documenting the academic journey of Grade 11 Lakambini students for the 2025-2026
              school year.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/auth" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Join Archives
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Write Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Class Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Class Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                <span>Grade 11 Lakambini</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-accent" />
                <span>Academic Year 2025-2026</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Lakambini XI Archives. Made with <Heart className="inline h-4 w-4 text-red-500 mx-1" /> by ADRXDEV.
          </p>
          <p className="text-xs text-muted-foreground">Preserving memories • Sharing stories • Building connections</p>
        </div>
      </div>
    </footer>
  )
}
