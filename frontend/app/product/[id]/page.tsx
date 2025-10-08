"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { ProductImage } from "@/components/product-image"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/products/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch product")
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async () => {
    if (!product) return

    try {
      const response = await fetch(`http://localhost:8080/api/products/${product.id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete product")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Spring Boot API Tester</h1>
            <nav className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
              <Link href="/add-product">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold">Product Details</h2>
              <p className="text-muted-foreground">View and manage product information</p>
            </div>
          </div>

          {loading && (
            <div className="text-center py-8">
              <p>Loading product details...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">Error: {error}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure your Spring Boot API is running on http://localhost:8080
              </p>
            </div>
          )}

          {product && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{product.name}</CardTitle>
                        <CardDescription className="text-base mt-2">{product.description}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {product.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                  <ProductImage productId={product.id} height={256} containerClassName="rounded-md mb-4" />
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Product Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Product ID</p>
                            <p className="font-medium">{product.id}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Category</p>
                            <p className="font-medium">{product.category}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">{product.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground mt-1">Current price</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Manage this product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="destructive" className="w-full" onClick={deleteProduct}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Product
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => fetchProduct(params.id as string)}
                    >
                      Refresh Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">API Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs">
                      <p className="text-muted-foreground">GET</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">/api/products/{product.id}</code>
                    </div>
                    <div className="text-xs">
                      <p className="text-muted-foreground">DELETE</p>
                      <code className="text-xs bg-muted px-2 py-1 rounded">/api/products/{product.id}</code>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
