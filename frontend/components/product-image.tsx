"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ProductImageProps = {
  productId: number | string
  alt?: string
  height?: number
  containerClassName?: string
  imgClassName?: string
}

export function ProductImage({
  productId,
  alt = "Product image",
  height = 192, // defaults to ~h-48
  containerClassName,
  imgClassName,
}: ProductImageProps) {
  const [hasImage, setHasImage] = React.useState(true)
  const src = `http://localhost:8080/api/${productId}/image`

  return (
    <div
      className={cn("w-full overflow-hidden rounded-md border border-border bg-muted", containerClassName)}
      style={{ height }}
      aria-label={alt}
    >
      {hasImage ? (
        <img
          src={src || "/placeholder.svg"}
          alt={alt}
          className={cn("h-full w-full object-cover", imgClassName)}
          onError={() => setHasImage(false)}
        />
      ) : (
        <div className="h-full w-full" />
      )}
    </div>
  )
}
