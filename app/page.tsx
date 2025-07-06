import { Suspense } from "react"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { PostCard } from "@/components/blog/post-card"
import { Button } from "@/components/ui/button"
import { PenTool, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"
import { PostCardSkeleton, HeroSkeleton } from "@/components/ui/loading-skeleton"

async function getPosts() {
  const supabase = createServerComponentClient({ cookies })

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) {
    console.error("Error fetching posts:", error)
    return []
  }

  return posts || []
}

function PostsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

async function PostsList() {
  const posts = await getPosts()

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="max-w-2xl mx-auto">
          <BookOpen className="h-16 w-16 mx-auto text-primary mb-6 float-animation" />
          <h3 className="text-2xl font-semibold mb-4 gradient-text">No Stories Yet</h3>
          <p className="text-muted-foreground mb-8 text-lg">
            Be the first to share your story with the world. Your words have the power to inspire, connect, and create
            change.
          </p>
          <Link href="/write">
            <Button size="lg" className="btn-gradient text-white font-semibold px-8 py-3">
              <PenTool className="mr-2 h-5 w-5" />
              Write Your First Story
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
      {posts.map((post, index) => (
        <div key={post.id} className={`animate-fade-in-delay-${Math.min(index + 1, 4)} w-full max-w-sm`}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[80vh] px-4 bg-grid-pattern">
        <Suspense fallback={<HeroSkeleton />}>
          <div className="text-center space-y-8 max-w-4xl animate-fade-in">
            <div className="space-y-4">
              <Sparkles className="h-16 w-16 mx-auto text-primary float-animation" />
              <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">Lakambini XI Archives</h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Where stories bloom like flowers in a digital garden. Share your voice, inspire others, and be part of
                our growing community.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/write">
                <Button size="lg" className="btn-gradient text-white font-semibold px-8 py-3 w-full sm:w-auto">
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
              <Link href="#stories">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 w-full sm:w-auto bg-transparent"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Read Stories
                </Button>
              </Link>
            </div>
          </div>
        </Suspense>
      </section>

      {/* Stories Section */}
      <section id="stories" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Latest Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover inspiring stories, thoughtful insights, and creative expressions from our community of writers.
            </p>
          </div>

          <Suspense fallback={<PostsGrid />}>
            <PostsList />
          </Suspense>

          <div className="text-center mt-12 animate-fade-in-delay-4">
            <Link href="/posts">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 bg-transparent"
              >
                View All Stories
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
