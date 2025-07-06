import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PostCard } from "@/components/blog/post-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Calendar } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/types"
import { Suspense } from "react"
import { ProfileSkeleton, PostCardSkeleton } from "@/components/ui/loading-skeleton"

async function ProfileContent() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: posts } = await supabase
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
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })

  const publishedPosts = posts?.filter((post) => post.published) || []
  const draftPosts = posts?.filter((post) => !post.published) || []

  const displayName = profile?.full_name || user.email
  const initials =
    displayName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"
  const joinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 animate-fade-in hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-lg hover:ring-primary/20 transition-all duration-300">
                <AvatarImage
                  src={profile?.avatar_url || "/placeholder.svg"}
                  alt={displayName || "User avatar"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{displayName}</CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/5 transition-colors duration-200 bg-transparent"
                  >
                    <Link href="/profile/edit" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6 text-sm">
              <div className="hover:bg-primary/5 p-2 rounded-lg transition-colors duration-200">
                <span className="font-semibold text-lg">{publishedPosts.length}</span>
                <span className="text-muted-foreground ml-1">Published Posts</span>
              </div>
              <div className="hover:bg-accent/5 p-2 rounded-lg transition-colors duration-200">
                <span className="font-semibold text-lg">{draftPosts.length}</span>
                <span className="text-muted-foreground ml-1">Drafts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {draftPosts.length > 0 && (
          <div className="mb-8 animate-fade-in-delay-1">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold">Drafts</h2>
              <Badge variant="secondary">{draftPosts.length}</Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {draftPosts.map((post: Post, index) => (
                <div key={post.id} className="animate-fade-in-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="animate-fade-in-delay-2">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-semibold">Published Posts</h2>
            <Badge variant="outline">{publishedPosts.length}</Badge>
          </div>
          {publishedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {publishedPosts.map((post: Post, index) => (
                <div key={post.id} className="animate-fade-in-stagger" style={{ animationDelay: `${index * 100}ms` }}>
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 animate-fade-in">
              <p className="text-muted-foreground">No published posts yet. Start writing to share your thoughts!</p>
              <Button asChild className="mt-4" size="lg">
                <Link href="/write">Write Your First Post</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileLoadingSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  )
}
