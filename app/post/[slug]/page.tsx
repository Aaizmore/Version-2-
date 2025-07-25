import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ShareButton } from "@/components/ui/share-button"
import { Suspense } from "react"
import { PostPageSkeleton } from "@/components/ui/loading-skeleton"
import type { Metadata } from "next"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const supabase = await createClient()

  try {
    const { data: posts } = await supabase.from("posts").select("slug").eq("published", true)

    return (
      posts?.map((post) => ({
        slug: post.slug,
      })) || []
    )
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  try {
    const { data: post } = await supabase
      .from("posts")
      .select(`
        title,
        excerpt,
        featured_image,
        profiles (
          full_name,
          email
        )
      `)
      .eq("slug", slug)
      .single()

    if (!post) {
      return {
        title: "Post Not Found - Lakambini XI Archives",
      }
    }

    const authorName = post.profiles?.full_name || post.profiles?.email || "Anonymous"

    return {
      title: `${post.title} - Lakambini XI Archives`,
      description: post.excerpt || `A story by ${authorName} from Lakambini XI Archives`,
      openGraph: {
        title: post.title,
        description: post.excerpt || `A story by ${authorName}`,
        images: post.featured_image ? [post.featured_image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt || `A story by ${authorName}`,
        images: post.featured_image ? [post.featured_image] : [],
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Post - Lakambini XI Archives",
    }
  }
}

async function PostContent({ slug }: { slug: string }) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: post, error } = await supabase
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
      .eq("slug", slug)
      .single()

    if (error || !post) {
      console.error("Error fetching post:", error)
      notFound()
    }

    // Check if user can see this post
    if (!post.published && (!user || user.id !== post.author_id)) {
      notFound()
    }

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    const isAuthor = user && user.id === post.author_id

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Back Navigation */}
          <div className="mb-6 animate-fade-in">
            <Button variant="ghost" asChild className="mb-4 hover:bg-primary/5 transition-colors duration-200">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back to Posts</span>
                <span className="sm:hidden">Back</span>
              </Link>
            </Button>
          </div>

          <article className="max-w-4xl mx-auto">
            <header className="mb-8 space-y-6 animate-fade-in-delay-1">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
                {post.profiles && (
                  <>
                    <User className="h-4 w-4 ml-2 sm:ml-4" />
                    <span className="truncate">{post.profiles.full_name || post.profiles.email}</span>
                  </>
                )}
                {!post.published && (
                  <Badge variant="secondary" className="ml-2 sm:ml-4">
                    Draft
                  </Badge>
                )}
              </div>

              {/* Title and Actions */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
                  {post.title}
                </h1>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <ShareButton title={post.title} text={post.excerpt ?? post.title} className="hidden sm:inline-flex" />
                  <ShareButton title={post.title} text={post.excerpt ?? post.title} iconOnly className="sm:hidden" />
                  {isAuthor && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary/5 transition-colors duration-200 bg-transparent"
                    >
                      <Link href={`/write/${post.id}`} className="flex items-center gap-2">
                        <Edit className="h-4 w-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
              )}
            </header>

            {/* Featured Image */}
            {post.featured_image && (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8 animate-fade-in-delay-2">
                <Image
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-lg max-w-none mb-8 animate-fade-in-delay-3">
              <div className="whitespace-pre-wrap leading-relaxed text-base sm:text-lg">{post.content}</div>
            </div>

            {/* Image Gallery */}
            {post.images && post.images.length > 1 && (
              <div className="space-y-6 mb-8 animate-fade-in-delay-4">
                <h3 className="text-xl sm:text-2xl font-semibold">Gallery</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {post.images.slice(1).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer animate-fade-in-stagger"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`Gallery image ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            {post.profiles && (
              <div className="border-t pt-8 mt-8 animate-fade-in-delay-5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{post.profiles.full_name || "Anonymous"}</h4>
                    <p className="text-sm text-muted-foreground">{post.profiles.email}</p>
                  </div>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in PostContent:", error)
    notFound()
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  return (
    <Suspense fallback={<PostPageSkeleton />}>
      <PostContent slug={slug} />
    </Suspense>
  )
}
