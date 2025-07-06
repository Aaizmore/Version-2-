import Link from "next/link"
import { GraduationCap, Heart, Github, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 font-bold text-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div>
                <span className="gradient-text">Lakambini XI</span>
                <div className="text-xs text-muted-foreground font-normal">Archives</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Preserving memories and experiences from our Grade 11 journey at Lakambini.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#stories" className="text-muted-foreground hover:text-primary transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link href="/write" className="text-muted-foreground hover:text-primary transition-colors">
                  Write
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/profile/edit" className="text-muted-foreground hover:text-primary transition-colors">
                  Edit Profile
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@lakambini-archives.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex gap-4">
              <a
                href="mailto:lakambini.archives@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/lakambini-xi"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Academic Year 2025-2026
              <br />
              Grade 11 Lakambini
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Lakambini XI Archives. All rights reserved.</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500" /> by Grade 11 Students
          </p>
        </div>
      </div>
    </footer>
  )
}
