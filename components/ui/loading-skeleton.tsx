import type React from "react"
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn("loading-shimmer rounded-md", className)} {...props} />
}

function PostCardSkeleton() {
  return (
    <div className="bg-card rounded-lg border professional-shadow p-6 space-y-4 animate-fade-in-stagger">
      <Skeleton className="h-48 w-full rounded-md" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  )
}

function PostPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="space-y-4">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <div className="flex items-center justify-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      </div>

      <Skeleton className="h-64 w-full rounded-lg" />

      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <Skeleton className="h-24 w-24 rounded-full mx-auto" />
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}

function HeroSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="text-center space-y-6 max-w-4xl animate-fade-in">
        <Skeleton className="h-16 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
        <div className="flex justify-center space-x-4">
          <Skeleton className="h-12 w-32 rounded-md" />
          <Skeleton className="h-12 w-32 rounded-md" />
        </div>
      </div>
    </div>
  )
}

export { Skeleton, PostCardSkeleton, PostPageSkeleton, ProfileSkeleton, HeroSkeleton }
