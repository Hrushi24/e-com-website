"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Plus } from "lucide-react"

interface FormData {
  name: string
  description: string
  brand: string
  price: string
  releaseDate: string
  category: string
  productAvailable: boolean
  stockQuantity: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    brand: "",
    price: "",
    releaseDate: "",
    category: "",
    productAvailable: false,
    stockQuantity: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        price: Number.parseFloat(formData.price),
        releaseDate: formData.releaseDate, // send as YYYY-MM-DD for simplicity
        category: formData.category,
        productAvailable: formData.productAvailable,
        stockQuantity: Number.isNaN(Number.parseInt(formData.stockQuantity, 10))
          ? 0
          : Number.parseInt(formData.stockQuantity, 10),
      }

      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Redirect to home page on success
      router.push("/")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product")
    } finally {
      setLoading(false)
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
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h2 className="text-3xl font-bold">Add New Product</h2>
              <p className="text-muted-foreground">Create a new product in your inventory</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>Fill in the details below to add a new product</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                {/* brand + category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      name="brand"
                      type="text"
                      placeholder="Enter brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      type="text"
                      placeholder="Enter category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* price + stockQuantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input
                      id="stockQuantity"
                      name="stockQuantity"
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* releaseDate + productAvailable */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="releaseDate">Release Date</Label>
                    <Input
                      id="releaseDate"
                      name="releaseDate"
                      type="date"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productAvailable" className="flex items-center gap-2">
                      <input
                        id="productAvailable"
                        name="productAvailable"
                        type="checkbox"
                        checked={formData.productAvailable}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4"
                        aria-checked={formData.productAvailable}
                      />
                      <span>Product Available</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Check if the product is currently available for sale.
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive">Error: {error}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Make sure your Spring Boot API is running on http://localhost:8080
                    </p>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Product"}
                  </Button>
                  <Link href="/">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
