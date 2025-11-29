"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { TopBar } from "@/components/top-bar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Grid, List, Search } from "lucide-react"
import { useState } from "react"
import { MediaUploader } from "@/components/media/media-uploader"
import { MediaGrid } from "@/components/media/media-grid"
import { MediaList } from "@/components/media/media-list"
import { StorageIndicator } from "@/components/media/storage-indicator"

interface MediaFile {
  id: string
  name: string
  type: "image" | "video"
  size: number
  uploadedDate: string
  url: string
  dimensions?: string
}

const mockMedia: MediaFile[] = [
  {
    id: "1",
    name: "living-room-bg.jpg",
    type: "image",
    size: 2.4,
    uploadedDate: "2024-06-10",
    url: "https://images.unsplash.com/photo-1564418614605-4798223b4831?w=400",
    dimensions: "1920x1080",
  },
  {
    id: "2",
    name: "bedroom-ambient.jpg",
    type: "image",
    size: 1.8,
    uploadedDate: "2024-06-09",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400",
    dimensions: "1920x1080",
  },
  {
    id: "3",
    name: "device-demo.mp4",
    type: "video",
    size: 45.2,
    uploadedDate: "2024-06-08",
    url: "https://videos.example.com/device-demo.mp4",
    dimensions: "1920x1080",
  },
  {
    id: "4",
    name: "welcome-screen.png",
    type: "image",
    size: 3.1,
    uploadedDate: "2024-06-07",
    url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400",
    dimensions: "1920x1080",
  },
  {
    id: "5",
    name: "automation-guide.mp4",
    type: "video",
    size: 52.5,
    uploadedDate: "2024-06-06",
    url: "https://videos.example.com/automation.mp4",
    dimensions: "1920x1080",
  },
]

export default function ContentLibraryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterType, setFilterType] = useState<"all" | "images" | "videos">("all")
  const [search, setSearch] = useState("")
  const [showUploader, setShowUploader] = useState(false)
  const [media, setMedia] = useState<MediaFile[]>(mockMedia)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)

  const filtered = media.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filterType === "all" || file.type === filterType
    return matchesSearch && matchesFilter
  })

  const totalSize = media.reduce((sum, file) => sum + file.size, 0)
  const usedStorage = totalSize
  const totalStorage = 10 // GB

  const handleAddMedia = (newFile: Partial<MediaFile>) => {
    const id = Date.now().toString()
    setMedia([
      ...media,
      {
        id,
        name: newFile.name || "Untitled",
        type: newFile.type || "image",
        size: newFile.size || 0,
        uploadedDate: new Date().toISOString().split("T")[0],
        url: newFile.url || "",
        dimensions: newFile.dimensions,
      } as MediaFile,
    ])
    setShowUploader(false)
  }

  const handleDeleteMedia = (id: string) => {
    setMedia(media.filter((file) => file.id !== id))
  }

  return (
    <ProtectedRoute>
      <SidebarNavigation />
      <TopBar />

      <main className="md:ml-64 pt-20 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Media Library</h1>
              <p className="text-muted-foreground mt-2">Manage your device imagery and media</p>
            </div>
            <Button onClick={() => setShowUploader(true)} className="mt-4 md:mt-0 gap-2 bg-accent hover:bg-accent/90">
              <Upload className="w-4 h-4" />
              Upload Media
            </Button>
          </div>

          {/* Upload Modal */}
          {showUploader && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Upload Media</h2>
                  <button
                    onClick={() => setShowUploader(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>
                <MediaUploader onUpload={handleAddMedia} onClose={() => setShowUploader(false)} />
              </Card>
            </div>
          )}

          {/* Storage Indicator */}
          <StorageIndicator used={usedStorage} total={totalStorage} />

          {/* Filter and View Options */}
          <Card className="p-4 mb-6 border-border/50">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search media..."
                  className="pl-10 bg-secondary/50 border-border/50"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {(["all", "images", "videos"] as const).map((type) => (
                  <Button
                    key={type}
                    size="sm"
                    variant={filterType === type ? "default" : "outline"}
                    onClick={() => setFilterType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>

              <div className="flex gap-1 border border-border/30 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>

          {/* Media Display */}
          {filtered.length > 0 ? (
            viewMode === "grid" ? (
              <MediaGrid files={filtered} onDelete={handleDeleteMedia} />
            ) : (
              <MediaList files={filtered} onDelete={handleDeleteMedia} />
            )
          ) : (
            <Card className="p-12 text-center border-border/50">
              <p className="text-muted-foreground mb-4">No media files found</p>
              <Button onClick={() => setShowUploader(true)} className="bg-accent hover:bg-accent/90">
                Upload your first file
              </Button>
            </Card>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}
