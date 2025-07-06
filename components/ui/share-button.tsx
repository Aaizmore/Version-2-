"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  className?: string
  iconOnly?: boolean
}

export function ShareButton({ title, text, url, className, iconOnly = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareUrl = url || window.location.href
    const shareData = {
      title,
      text,
      url: shareUrl,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
        toast.success("Shared successfully!")
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error("Error sharing:", error)
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Link copied to clipboard!")
        setTimeout(() => setCopied(false), 2000)
      } catch (clipboardError) {
        console.error("Error copying to clipboard:", clipboardError)
        toast.error("Failed to share or copy link")
      }
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className={cn("hover:bg-primary/5 transition-colors duration-200 bg-transparent", className)}
    >
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {!iconOnly && <span className="ml-2">{copied ? "Copied!" : "Share"}</span>}
    </Button>
  )
}
