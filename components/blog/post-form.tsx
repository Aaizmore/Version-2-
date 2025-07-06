"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/ui/image-upload"
import { LoadingButton } from "@/components/ui/loading-button"
import { createClient } from "@/lib/supabase/client"
import { generateSlug } from "@/lib/utils/slug"
import { uploadImage, deleteImage } from "@/lib/utils/image-upload"
import { cleanupUnusedImages } from "@/lib/utils/image-cleanup"
import { ArrowLeft, Save, Eye, Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import type { Post } from "@/lib/types"

interface PostFormProps {
  post?: Post
  isEditing?: boolean
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    title: post?.title || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    published: post?.published || false,
  })

  const [featuredImage, setFeaturedImage] = useState<string | null>(post?.featured_image || null)
  const [additionalImages, setAdditionalImages] = useState<string[]>(post?.images?.slice(1) || [])
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File, isFeatured = false) => {
    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file)

      if (isFeatured) {
        // Remove old featured image if exists
        if (featuredImage) {
          await deleteImage(featuredImage)
        }
        setFeaturedImage(imageUrl)
        toast.success("Featured image uploaded successfully!")
      } else {
        setAdditionalImages((prev) => [...prev, imageUrl])
        toast.success("Image uploaded successfully!")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageRemove = async (imageUrl: string, isFeatured = false) => {
    try {
      await deleteImage(imageUrl)

      if (isFeatured) {
        setFeaturedImage(null)
      } else {
        setAdditionalImages((prev) => prev.filter((img) => img !== imageUrl))
      }

      toast.success("Image removed successfully!")
    } catch (error) {
      console.error("Remove error:", error)
      toast.error("Failed to remove image.")
    }
  }

  const handleSubmit = async (published: boolean) => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (!formData.content.trim()) {
      toast.error("Please enter some content")
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          toast.error("You must be logged in to save posts")
          return
        }

        const slug = generateSlug(formData.title)
        const allImages = featuredImage ? [featuredImage, ...additionalImages] : additionalImages

        const postData = {
          title: formData.title.trim(),
          excerpt: formData.excerpt.trim() || null,
          content: formData.content.trim(),
          slug,
          published,
          featured_image: featuredImage,
          images: allImages.length > 0 ? allImages : null,
          author_id: user.id,
        }

        let result
        if (isEditing && post) {
          result = await supabase
            .from("posts")
            .update(postData)
            .eq("id", post.id)
            .eq("author_id", user.id)
            .select()
            .single()
        } else {
          result = await supabase.from("posts").insert([postData]).select().single()
        }

        if (result.error) {
          throw result.error
        }

        // Clean up unused images
        if (isEditing && post) {
          await cleanupUnusedImages(post.images || [], allImages)
        }

        toast.success(
          published
            ? `Post ${isEditing ? "updated and published" : "published"} successfully!`
            : `Draft ${isEditing ? "updated" : "saved"} successfully!`,
        )

        router.push(published ? `/post/${slug}` : "/profile")
        router.refresh()
      } catch (error) {
        console.error("Save error:", error)
        toast.error("Failed to save post. Please try again.")
      }
    })
  }

  const handleDelete = async () => {
    if (!post || !isEditing) return

    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to delete posts")
        return
      }

      // Delete all associated images
      if (post.images) {
        await Promise.all(post.images.map((imageUrl) => deleteImage(imageUrl)))
      }

      const { error } = await supabase.from("posts").delete().eq("id", post.id).eq("author_id", user.id)

      if (error) throw error

      toast.success("Post deleted successfully!")
      router.push("/profile")
      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("Failed to delete post. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild className="hover:bg-primary/5 transition-colors duration-200">
            <Link href="/profile" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{isEditing ? "Edit Post" : "Write New Post"}</h1>
            <p className="text-muted-foreground">
              {isEditing ? "Update your story" : "Share your Grade 11 experience"}
            </p>
          </div>
        </div>

        {isEditing && (
          <LoadingButton
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            loading={isDeleting}
            loadingText="Deleting..."
            className="hover:bg-destructive/90 transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </LoadingButton>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="animate-fade-in-delay-1 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter your post title..."
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your post (optional)..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  placeholder="Share your story, experiences, thoughts..."
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  rows={12}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Images Section */}
          <Card className="animate-fade-in-delay-2 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Featured Image */}
              <div className="space-y-3">
                <Label>Featured Image</Label>
                <ImageUpload
                  onUpload={(file) => handleImageUpload(file, true)}
                  onRemove={() => featuredImage && handleImageRemove(featuredImage, true)}
                  currentImage={featuredImage}
                  isUploading={isUploading}
                  className="aspect-video"
                />
              </div>

              {/* Additional Images */}
              <div className="space-y-3">
                <Label>Additional Images</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {additionalImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative group animate-fade-in-stagger"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img
                          src={imageUrl || "/placeholder.svg"}
                          alt={`Additional image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => handleImageRemove(imageUrl)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}

                  <ImageUpload
                    onUpload={(file) => handleImageUpload(file, false)}
                    isUploading={isUploading}
                    className="aspect-square"
                    showPreview={false}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="animate-fade-in-delay-3 hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={formData.published ? "default" : "secondary"}>
                  {formData.published ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                <LoadingButton
                  onClick={() => handleSubmit(false)}
                  variant="outline"
                  loading={isPending}
                  loadingText="Saving..."
                  className="w-full hover:bg-muted transition-colors duration-200"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </LoadingButton>

                <LoadingButton
                  onClick={() => handleSubmit(true)}
                  loading={isPending}
                  loadingText="Publishing..."
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isEditing ? "Update & Publish" : "Publish Post"}
                </LoadingButton>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {formData.title && (
            <Card className="animate-fade-in-delay-4 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {featuredImage && (
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={featuredImage || "/placeholder.svg"}
                        alt="Featured preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold line-clamp-2">{formData.title}</h3>
                    {formData.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-1">{formData.excerpt}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
