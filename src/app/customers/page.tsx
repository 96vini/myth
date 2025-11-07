"use client"

import { useState } from "react"
import {
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UserIcon,
  MoreVerticalIcon,
  Instagram,
  Facebook,
  Twitter,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ImageIcon,
  Upload,
} from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Post type definition
type Post = {
  id: string
  title: string
  content: string
  coverImage: string
  platform: "instagram" | "facebook" | "twitter"
  reach: number
  reachChange: number // percentage change
  likes: number
  comments: number
  shares: number
  tags: string[]
  status: "published" | "draft" | "scheduled"
  createdAt: string
}

const initialPosts: Post[] = [
  {
    id: "1",
    title: "My Birthday",
    content: "Celebrating another year of growth and learning...",
    coverImage: "https://picsum.photos/400/300?random=1",
    platform: "instagram",
    reach: 12500,
    reachChange: 12.5,
    likes: 342,
    comments: 28,
    shares: 15,
    tags: ["birthday", "celebration", "personal"],
    status: "published",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "About My Work",
    content: "Sharing insights from my latest project...",
    coverImage: "https://picsum.photos/400/300?random=2",
    platform: "facebook",
    reach: 8900,
    reachChange: -5.2,
    likes: 189,
    comments: 12,
    shares: 8,
    tags: ["work", "professional", "insights"],
    status: "published",
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    title: "China and the world",
    content: "Exploring global perspectives and connections...",
    coverImage: "https://picsum.photos/400/300?random=3",
    platform: "twitter",
    reach: 15200,
    reachChange: 8.3,
    likes: 456,
    comments: 67,
    shares: 34,
    tags: ["global", "china", "world"],
    status: "draft",
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    title: "The AI will take over the world?",
    content: "Thoughts on artificial intelligence and its impact...",
    coverImage: "https://picsum.photos/400/300?random=4",
    platform: "instagram",
    reach: 23400,
    reachChange: 18.7,
    likes: 892,
    comments: 124,
    shares: 56,
    tags: ["ai", "technology", "future"],
    status: "published",
    createdAt: "2024-01-05",
  },
]

export default function CustomersPage() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Post, "id" | "createdAt" | "likes" | "comments" | "shares">>({
    title: "",
    content: "",
    coverImage: "",
    platform: "instagram",
    reach: 0,
    reachChange: 0,
    tags: [],
    status: "draft",
  })

  // Filter posts based on search
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "tags") {
      setFormData({ ...formData, tags: value.split(",").map(t => t.trim()).filter(Boolean) })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Open dialog for adding new post
  const handleAddPost = () => {
    setEditingPost(null)
    setFormData({
      title: "",
      content: "",
      coverImage: "",
      platform: "instagram",
      reach: 0,
      reachChange: 0,
      tags: [],
      status: "draft",
    })
    setIsDialogOpen(true)
  }

  // Open dialog for editing post
  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      content: post.content,
      coverImage: post.coverImage,
      platform: post.platform,
      reach: post.reach,
      reachChange: post.reachChange,
      tags: post.tags,
      status: post.status,
    })
    setIsDialogOpen(true)
  }

  // Save post (create or update)
  const handleSavePost = () => {
    if (editingPost) {
      // Update existing post
      setPosts(
        posts.map((p) =>
          p.id === editingPost.id
            ? { ...p, ...formData, likes: editingPost.likes, comments: editingPost.comments, shares: editingPost.shares }
            : p
        )
      )
    } else {
      // Add new post
      const newPost: Post = {
        id: Date.now().toString(),
        ...formData,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setPosts([...posts, newPost])
    }
    setIsDialogOpen(false)
  }

  // Open delete confirmation dialog
  const handleDeleteClick = (postId: string) => {
    setDeletingPostId(postId)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete post
  const handleConfirmDelete = () => {
    if (deletingPostId) {
      setPosts(posts.filter((p) => p.id !== deletingPostId))
      setIsDeleteDialogOpen(false)
      setDeletingPostId(null)
    }
  }

  // Get status badge variant
  const getStatusVariant = (status: Post["status"]) => {
    switch (status) {
      case "published":
        return "default"
      case "draft":
        return "secondary"
      case "scheduled":
        return "outline"
      default:
        return "default"
    }
  }

  // Get platform icon
  const getPlatformIcon = (platform: Post["platform"]) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      case "twitter":
        return <Twitter className="h-4 w-4" />
    }
  }

  // Get platform color
  const getPlatformColor = (platform: Post["platform"]) => {
    switch (platform) {
      case "instagram":
        return "text-pink-500"
      case "facebook":
        return "text-blue-500"
      case "twitter":
        return "text-sky-500"
    }
  }

  // Format reach number
  const formatReach = (reach: number) => {
    if (reach >= 1000000) return `${(reach / 1000000).toFixed(1)}M`
    if (reach >= 1000) return `${(reach / 1000).toFixed(1)}k`
    return reach.toString()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Apple-style Content */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-background to-muted/30 shadow-2xl border border-border/50 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
            <div className="relative p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Meus Posts</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredPosts.length} post(s) encontrado(s)
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative w-full md:w-72">
                    <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Buscar posts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 h-11 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm shadow-sm focus-visible:ring-primary"
                    />
                  </div>
                  <Button 
                    onClick={handleAddPost} 
                    className="w-full md:w-auto h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Novo Post
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 overflow-hidden bg-background/50 backdrop-blur-sm shadow-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="font-semibold">Post</TableHead>
                      <TableHead className="font-semibold">Plataforma</TableHead>
                      <TableHead className="font-semibold">Engajamento</TableHead>
                      <TableHead className="font-semibold">Alcance</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="text-right font-semibold">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-3">
                              <ImageIcon className="h-8 w-8" />
                            </div>
                            <p className="font-medium">Nenhum post encontrado</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post, index) => (
                        <TableRow 
                          key={post.id}
                          className="border-border/30 hover:bg-muted/30 transition-colors animate-in fade-in-50 slide-in-from-bottom-2"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-border/30">
                                <Image 
                                  src={post.coverImage} 
                                  alt={post.title} 
                                  width={64} 
                                  height={64} 
                                  className="object-cover w-full h-full"
                                  onError={(e) => {
                                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%239ca3af' font-size='12'%3EImagem%3C/text%3E%3C/svg%3E"
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{post.title}</p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{post.content}</p>
                                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                  {post.tags.slice(0, 2).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                      #{tag}
                                    </Badge>
                                  ))}
                                  {post.tags.length > 2 && (
                                    <span className="text-xs text-muted-foreground">+{post.tags.length - 2}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`${getPlatformColor(post.platform)}`}>
                                {getPlatformIcon(post.platform)}
                              </div>
                              <span className="text-sm font-medium capitalize">{post.platform}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>{post.comments}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Share2 className="h-3.5 w-3.5" />
                                <span>{post.shares}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1.5">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold text-sm">{formatReach(post.reach)}</span>
                              </div>
                              <div className={`flex items-center gap-0.5 text-xs font-medium ${
                                post.reachChange >= 0 ? "text-emerald-600" : "text-red-600"
                              }`}>
                                {post.reachChange >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                <span>{Math.abs(post.reachChange)}%</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(post.status)} className="rounded-full font-medium">
                              {post.status === "published" && "Publicado"}
                              {post.status === "draft" && "Rascunho"}
                              {post.status === "scheduled" && "Agendado"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-9 w-9 rounded-full hover:bg-muted/50"
                                >
                                  <MoreVerticalIcon className="h-4 w-4" />
                                  <span className="sr-only">Abrir menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleEditPost(post)}
                                  className="rounded-lg"
                                >
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteClick(post.id)}
                                  className="text-destructive focus:text-destructive rounded-lg"
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>

      {/* Add/Edit Post Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl border-border/50">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">
              {editingPost ? "Editar Post" : "Novo Post"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {editingPost
                ? "Atualize as informações do post abaixo."
                : "Preencha as informações do novo post abaixo."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="grid gap-3">
              <Label htmlFor="title" className="text-sm font-semibold">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Meu novo post"
                value={formData.title}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="content" className="text-sm font-semibold">Conteúdo</Label>
              <textarea
                id="content"
                name="content"
                placeholder="Escreva o conteúdo do post..."
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className="flex w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="coverImage" className="text-sm font-semibold">Imagem de Capa</Label>
              <div className="space-y-2">
                <Input
                  id="coverImage"
                  name="coverImage"
                  placeholder="URL da Imagem ou cole o link aqui"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
                />
                {formData.coverImage && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border border-border/30">
                    <Image 
                      src={formData.coverImage} 
                      alt="Preview" 
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-3">
                <Label htmlFor="platform" className="text-sm font-semibold">Plataforma</Label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                </select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="status" className="text-sm font-semibold">Status</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="flex h-11 w-full rounded-xl border border-border/50 bg-background px-4 py-2 text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <option value="published">Publicado</option>
                  <option value="draft">Rascunho</option>
                  <option value="scheduled">Agendado</option>
                </select>
              </div>
            </div>
            <div className="grid gap-3">
              <Label htmlFor="tags" className="text-sm font-semibold">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="exemplo: tecnologia, design, inovação"
                value={formData.tags.join(", ")}
                onChange={handleInputChange}
                className="h-11 rounded-xl border-border/50 focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="h-11 rounded-xl"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSavePost}
              className="h-11 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {editingPost ? "Salvar Alterações" : "Criar Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-3xl border-border/50">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-base">
              Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="h-11 rounded-xl"
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              className="h-11 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


