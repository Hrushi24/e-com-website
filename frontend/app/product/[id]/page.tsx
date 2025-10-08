"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { ProductImage } from "@/components/product-image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

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

  const [isEditing, setIsEditing] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)


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


  const startEditing = () => {
    if (!product) return
    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      category: product.category ?? "",
      price: product.price != null ? String(product.price) : "",
    })
    setImageFile(null)
    setUpdateError(null)
    setUpdateSuccess(null)
    setIsEditing(true)
  }

  const submitUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return
    try {
      setUpdating(true)
      setUpdateError(null)
      setUpdateSuccess(null)

      const payload = {
        id: product.id,
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number.parseFloat(form.price || "0"),
      }

      const response = await fetch(`http://localhost:8080/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Optionally upload a new image file if selected
      if (imageFile) {
        const imgForm = new FormData()
        // Backend can adjust the field name if needed (e.g., "file"); using "image" here.
        imgForm.append("image", imageFile)
        const imgResp = await fetch(`http://localhost:8080/api/${product.id}/image`, {
          method: "PUT",
          body: imgForm,
        })
        if (!imgResp.ok) {
          throw new Error(`Image upload failed with status: ${imgResp.status}`)
        }
      }

      setUpdateSuccess("Product updated successfully.")
      await fetchProduct(String(product.id))
      setImageFile(null)
      setIsEditing(false)
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Failed to update product")
    } finally {
      setUpdating(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }))
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
                      {isEditing ? (
                          <Input
                            name="name"
                            value={form.name}
                            onChange={handleInputChange}
                            className="text-2xl font-bold"
                          />
                        ) : (
                          <CardTitle className="text-2xl">{product.name}</CardTitle>
                        )}
                        {isEditing ? (
                          <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            className="text-base mt-2"
                          />
                        ) : (
                          <CardDescription className="text-base mt-2">{product.description}</CardDescription>
                        )}
                      </div>
                      <Badge variant="secondary" className="text-sm">
                      {isEditing ? (
                          <Input
                            name="category"
                            value={form.category}
                            onChange={handleInputChange}
                            className="text-sm"
                          />
                        ) : (
                          product.category
                        )}
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
                            {isEditing ? (
                              <Input
                                name="category"
                                value={form.category}
                                onChange={handleInputChange}
                                className="font-medium"
                              />
                            ) : (
                              <p className="font-medium">{product.category}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        {isEditing ? (
                          <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleInputChange}
                            className="font-medium"
                          />
                        ) : (
                          <p className="font-medium">{product.description}</p>
                        )}
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
                    {isEditing ? (
                        <Input
                          name="price"
                          value={form.price}
                          onChange={handleInputChange}
                          className="text-3xl font-bold text-primary"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>Manage this product</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="default" className="w-full" onClick={startEditing}>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Product
                    </Button>
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

                {isEditing && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Update Product</CardTitle>
                      <CardDescription>Edit fields and save changes</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {updateError && (
                        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-2 mb-4 text-sm text-destructive">
                          {updateError}
                        </div>
                      )}
                      {updateSuccess && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-md p-2 mb-4 text-sm text-green-600">
                          {updateSuccess}
                        </div>
                      )}
                      <form onSubmit={submitUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={form.category}
                              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                              id="price"
                              type="number"
                              step="0.01"
                              value={form.price}
                              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newImage">New Image (optional)</Label>
                          <Input
                            id="newImage"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                          />
                          {imageFile ? (
                            <p className="text-xs text-muted-foreground">Selected: {imageFile.name}</p>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button type="submit" disabled={updating}>
                            {updating ? "Saving..." : "Save Changes"}
                          </Button>
                          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

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
