import { createClient } from "@/lib/supabase/server"
import { PostCard } from "@/components/blog/post-card"
import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, Users, Award, GraduationCap } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/types"
import { Suspense } from "react"
import { HeroSkeleton, PostCardSkeleton } from "@/components/ui/loading-skeleton"

async function HeroSection() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: posts } = await supabase.from("posts").select("id").eq("published", true)

    return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1 float-animation">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                    </div>
                  </div>
                  <Award className="absolute -top-2 -right-2 h-6 w-6 text-secondary animate-pulse" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                <span className="gradient-text">Lakambini XI Archives</span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-4 animate-fade-in-delay-1">
                Official digital archives platform for Grade 11 Lakambini students
              </p>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-delay-2">
                Document your academic journey, share meaningful experiences, and preserve memories from our Grade 11
                year (2025-2026)
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in-delay-3">
                {user ? (
                  <Button
                    asChild
                    size="lg"
                    className="btn-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/write" className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Share Your Story
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      asChild
                      size="lg"
                      className="btn-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <Link href="/auth">Join Our Archives</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="border-primary/20 hover:bg-primary/5 bg-transparent"
                    >
                      <Link href="#stories">Browse Stories</Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto animate-fade-in-delay-4">
                <div className="text-center p-4 rounded-lg card-gradient hover:bg-white/70 transition-all duration-300">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">Grade 11</div>
                  <div className="text-sm text-muted-foreground">Lakambini Class</div>
                </div>
                <div className="text-center p-4 rounded-lg card-gradient hover:bg-white/70 transition-all duration-300">
                  <BookOpen className="h-8 w-8 text-secondary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary">{posts?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Stories Shared</div>
                </div>
                <div className="text-center p-4 rounded-lg card-gradient hover:bg-white/70 transition-all duration-300">
                  <Award className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">2025-2026</div>
                  <div className="text-sm text-muted-foreground">Academic Year</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Error in HeroSection:", error)
    return <HeroSkeleton />
  }
}

async function StoriesSection() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        profiles (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
      .eq("published", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching posts:", error)
      return <div className="text-center py-16">Error loading stories</div>
    }

    return (
      <section id="stories" className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            {posts && posts.length > 0 ? (
              <div className="space-y-12 w-full max-w-7xl">
                <div className="text-center animate-fade-in">
                  <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                    <span className="gradient-text">Our Stories</span>
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover the experiences, thoughts, and memories shared by our Grade 11 Lakambini students
                  </p>
                </div>

                <div className="grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                  {posts.map((post: Post, index) => (
                    <div
                      key={post.id}
                      className="animate-fade-in-stagger w-full max-w-sm"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 sm:py-24 animate-fade-in max-w-2xl">
                <div className="relative mb-8">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto float-animation">
                    <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-primary" />
                  </div>
                  <Award className="absolute top-0 right-1/2 transform translate-x-12 h-6 w-6 text-secondary animate-pulse" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                  <span className="gradient-text">Be the First to Share</span>
                </h3>

                <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Start documenting your Grade 11 journey and inspire your classmates to share their stories too.
                </p>

                {user ? (
                  <Button
                    asChild
                    size="lg"
                    className="btn-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/write" className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Write First Story
                    </Link>
                  </Button>
                ) : (
                  <Button
                    asChild
                    size="lg"
                    className="btn-gradient text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Link href="/auth">Get Started</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  } catch (error) {
    console.error("Error in StoriesSection:", error)
    return (
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Error loading stories. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }
}

function PostsLoadingSkeleton() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center">
          <div className="space-y-12 w-full max-w-7xl">
            <div className="text-center">
              <div className="h-12 w-64 bg-muted rounded-lg mx-auto mb-4 animate-pulse shimmer" />
              <div className="h-6 w-96 bg-muted rounded-lg mx-auto animate-pulse shimmer" />
            </div>
            <div className="grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-full max-w-sm">
                  <PostCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<PostsLoadingSkeleton />}>
        <StoriesSection />
      </Suspense>
    </div>
  )
}
