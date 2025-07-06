import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, ImageIcon, Clock } from "lucide-react"
import type { Post } from "@/lib/types"
import Image from "next/image"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const authorName = post.profiles?.full_name || post.profiles?.email || "Anonymous"
  const authorInitials = authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const readingTime = Math.ceil(post.content.split(" ").length / 200) // Approximate reading time

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 overflow-hidden group glass-effect hover:scale-[1.02] border-primary/10 professional-card">
      {post.featured_image && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={post.featured_image || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          {post.images && post.images.length > 1 && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-black/50 text-white border-0 backdrop-blur-sm">
                <ImageIcon className="h-3 w-3 mr-1" />
                {post.images.length}
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
            <AvatarImage
              src={post.profiles?.avatar_url || "/placeholder.svg"}
              alt={authorName}
              className="object-cover"
            />
            <AvatarFallback className="bg-gradient-to-br from-primary/10 to-accent/10 text-primary text-xs font-semibold">
              {authorInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="truncate font-medium text-foreground">{authorName}</span>
              <span className="text-primary/40">•</span>
              <Calendar className="h-3 w-3 text-primary/60" />
              <span className="text-xs">{formatDate(post.created_at)}</span>
            </div>
          </div>
        </div>

        <Link href={`/post/${post.slug}`} className="group/title">
          <h2 className="text-lg sm:text-xl font-semibold group-hover/title:text-primary transition-colors duration-300 line-clamp-2 leading-tight mb-2">
            {post.title}
          </h2>
        </Link>
      </CardHeader>

      <CardContent className="pt-0">
        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-3 mb-4 text-sm leading-relaxed">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/post/${post.slug}`}>
              <Badge
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer"
              >
                Read More
              </Badge>
            </Link>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min read</span>
            </div>
          </div>
          {!post.published && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Draft
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
