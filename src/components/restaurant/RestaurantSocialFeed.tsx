import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  CornerDownRight,
  Star,
  Plus,
  X,
  CheckCircle2,
  Calendar,
  HelpCircle,
  ChefHat,
  Filter,
  Flame,
  Check
} from 'lucide-react'
import type { Restaurant } from '@/types/restaurant.types'
import { supabase } from '@/lib/supabase'

export interface SocialPost {
  id: string
  restaurantId: string
  title: string
  category: 'dish' | 'event' | 'ambiance' | 'recipe'
  description: string
  mediaUrl?: string
  mediaType?: 'image' | 'video'
  price?: number
  currency?: string
  likesCount: number
  isLiked?: boolean
  createdAt: string
  isFeatured?: boolean
  comments: SocialComment[]
}

export interface SocialComment {
  id: string
  authorName: string
  authorRole: 'client' | 'restaurant'
  content: string
  rating?: number // 1 to 5 for reviews
  createdAt: string
  type: 'review' | 'comment' | 'question'
  restaurantReply?: {
    authorName: string
    content: string
    createdAt: string
  }
}

interface RestaurantSocialFeedProps {
  restaurant: Restaurant
  isPublicView?: boolean
}

export const RestaurantSocialFeed: React.FC<RestaurantSocialFeedProps> = ({
  restaurant,
  isPublicView = false,
}) => {
  const storageKey = `mdj_social_posts_${restaurant.id}`

  // Initial dummy / seeded posts for great UX right out of the box
  const getInitialPosts = (): SocialPost[] => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse saved social posts', e)
      }
    }

    return [
      {
        id: 'post-seed-1',
        restaurantId: restaurant.id,
        title: 'Nouveau Plat Signature : Dos de Saumon Rôti aux Agrumes & Émulsion Coco',
        category: 'dish',
        description: 'Le Chef vous présente notre création du jour ! Cuit à basse température avec sa tombée de légumes croquants du terroir et son jus d\'herbes fraîches. À déguster dès ce midi en terrasse ou en salle.',
        mediaUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        price: 9500,
        currency: 'FCFA',
        likesCount: 24,
        isLiked: false,
        createdAt: 'Il y a 2 heures',
        isFeatured: true,
        comments: [
          {
            id: 'c-1',
            authorName: 'Alexandre M.',
            authorRole: 'client',
            content: 'Absolument divin ! J\'ai eu la chance de le goûter ce midi, la cuisson du saumon était d\'une précision chirurgicale.',
            rating: 5,
            createdAt: 'Il y a 1 heure',
            type: 'review',
            restaurantReply: {
              authorName: restaurant.name,
              content: 'Merci infiniment Alexandre ! Toute l\'équipe en cuisine est ravie que la nouvelle recette vous ait conquis.',
              createdAt: 'Il y a 45 min',
            },
          },
          {
            id: 'c-2',
            authorName: 'Sophie B.',
            authorRole: 'client',
            content: 'Bonjour ! Ce plat convient-il à une personne intolérante au gluten et au lactose ?',
            createdAt: 'Il y a 30 min',
            type: 'question',
            restaurantReply: {
              authorName: restaurant.name,
              content: 'Bonjour Sophie ! Oui tout à fait, l\'émulsion est 100% lait de coco sans produit laitier, et nous utilisons des farines de manioc sans gluten.',
              createdAt: 'Il y a 15 min',
            },
          },
        ],
      },
      {
        id: 'post-seed-2',
        restaurantId: restaurant.id,
        title: 'Coulant Cœur Chocolat Noir 70% & Glace Vanille Bourbon de Madagascar',
        category: 'recipe',
        description: 'Un classique indémodable revisité par notre chef pâtissier. Craquant à l\'extérieur, fondant intense au cœur.',
        mediaUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1200&q=80',
        mediaType: 'image',
        price: 4500,
        currency: 'FCFA',
        likesCount: 38,
        isLiked: true,
        createdAt: 'Hier à 19:30',
        isFeatured: false,
        comments: [
          {
            id: 'c-3',
            authorName: 'Marcelle K.',
            authorRole: 'client',
            content: 'Le meilleur fondant de la ville sans hésitation !',
            rating: 5,
            createdAt: 'Hier à 21:00',
            type: 'review',
          },
        ],
      },
    ]
  }

  const [posts, setPosts] = useState<SocialPost[]>(getInitialPosts)
  const [activeFilter, setActiveFilter] = useState<'all' | 'dish' | 'recipe' | 'event' | 'ambiance'>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null)

  // New Post Form State
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<'dish' | 'event' | 'ambiance' | 'recipe'>('dish')
  const [newDescription, setNewDescription] = useState('')
  const [newPrice, setNewPrice] = useState<string>('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Interactive comment input states
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [commentContent, setCommentContent] = useState('')
  const [commentType, setCommentType] = useState<'comment' | 'review' | 'question'>('comment')
  const [commentRating, setCommentRating] = useState(5)
  const [clientName, setClientName] = useState('')

  // Restaurant Reply state
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(posts))
    } catch (e) {
      console.error('Failed to save social posts to localStorage', e)
    }
  }, [posts, storageKey])

  // Handle media selection
  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 100 * 1024 * 1024) {
      alert('Le fichier sélectionné dépasse la taille limite de 100 Mo.')
      return
    }

    setMediaFile(file)
    const previewUrl = URL.createObjectURL(file)
    setMediaPreview(previewUrl)
  }

  // Handle Post Creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      alert('Veuillez saisir un titre ou nom de prestation.')
      return
    }

    setIsUploading(true)

    let finalMediaUrl: string | undefined = undefined
    let finalMediaType: 'image' | 'video' | undefined = undefined

    if (mediaFile) {
      finalMediaType = mediaFile.type.startsWith('video/') ? 'video' : 'image'
      try {
        if (supabase) {
          const fileExt = mediaFile.name.split('.').pop() || (mediaFile.type.startsWith('video/') ? 'mp4' : 'jpg')
          const fileName = `${restaurant.id}/gallery/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const { error: uploadErr } = await supabase.storage
            .from('menu-photos')
            .upload(fileName, mediaFile, {
              cacheControl: '3600',
              upsert: false,
              contentType: mediaFile.type,
            })

          if (!uploadErr) {
            const { data: publicData } = supabase.storage.from('menu-photos').getPublicUrl(fileName)
            finalMediaUrl = publicData.publicUrl
          } else {
            finalMediaUrl = mediaPreview || undefined
          }
        } else {
          finalMediaUrl = mediaPreview || undefined
        }
      } catch (err) {
        console.warn('Fallback preview for media upload', err)
        finalMediaUrl = mediaPreview || undefined
      }
    }

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      restaurantId: restaurant.id,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      mediaUrl: finalMediaUrl,
      mediaType: finalMediaType,
      price: newPrice ? parseFloat(newPrice) : undefined,
      currency: 'FCFA',
      likesCount: 0,
      isLiked: false,
      createdAt: 'À l\'instant',
      isFeatured,
      comments: [],
    }

    setPosts([newPost, ...posts])
    setIsUploading(false)
    setIsCreateModalOpen(false)

    // Reset Form
    setNewTitle('')
    setNewDescription('')
    setNewPrice('')
    setMediaFile(null)
    setMediaPreview(null)
    setIsFeatured(false)
  }

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked
          return {
            ...p,
            isLiked,
            likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          }
        }
        return p
      })
    )
  }

  // Add Comment / Review / Question
  const handleAddComment = (postId: string) => {
    if (!commentContent.trim()) return

    const newComment: SocialComment = {
      id: `comment-${Date.now()}`,
      authorName: clientName.trim() || 'Client Gourmand',
      authorRole: 'client',
      content: commentContent.trim(),
      type: commentType,
      rating: commentType === 'review' ? commentRating : undefined,
      createdAt: 'À l\'instant',
    }

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          }
        }
        return p
      })
    )

    setCommentContent('')
    setClientName('')
    setActiveCommentPostId(null)
  }

  // Restaurant Reply to a Comment or Question
  const handleReplyToComment = (postId: string, commentId: string) => {
    if (!replyContent.trim()) return

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.map((c) => {
              if (c.id === commentId) {
                return {
                  ...c,
                  restaurantReply: {
                    authorName: restaurant.name,
                    content: replyContent.trim(),
                    createdAt: 'À l\'instant',
                  },
                }
              }
              return c
            }),
          }
        }
        return p
      })
    )

    setReplyContent('')
    setReplyingToCommentId(null)
  }

  // Copy post link
  const handleSharePost = (postId: string) => {
    const url = `${window.location.origin}/r/${restaurant.slug || restaurant.id}#post-${postId}`
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopiedPostId(postId)
      setTimeout(() => setCopiedPostId(null), 2500)
    } else {
      alert(`Lien de partage : ${url}`)
    }
  }

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'all') return true
    return p.category === activeFilter
  })

  const getCategoryLabel = (category: SocialPost['category']) => {
    switch (category) {
      case 'dish':
        return 'Plat & Recette du Chef'
      case 'recipe':
        return 'Création Pâtisserie & Douceurs'
      case 'event':
        return 'Événement & Prestation Traiteur'
      case 'ambiance':
        return 'Ambiance & Décoration'
      default:
        return 'Publication'
    }
  }

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. HEADER BANNER & ACTION BAR                                             */}
      {/* ========================================================================= */}
      <div className="bg-surface-container-lowest rounded-2xl border border-surface-container p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary-container text-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-on-surface font-headline-sm">
              Galerie, Réalisations & Prestations
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-secondary text-xs font-semibold">
              Espace Interactif
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">
            {isPublicView
              ? "Découvrez en direct les dernières créations culinaires, plats d'exception et avis des gourmets. Posez vos questions et partagez votre avis !"
              : "Publiez vos créations, plats récents et prestations. Interagissez avec vos clients, répondez à leurs questions et recueillez leurs avis en direct !"}
          </p>
        </div>

        {!isPublicView && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-primary text-on-primary hover:bg-primary/90 font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow cursor-pointer flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            Publier une réalisation / un plat
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 2. FILTRES DU FLUX                                                        */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeFilter === 'all'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Toutes les réalisations ({posts.length})
        </button>
        <button
          onClick={() => setActiveFilter('dish')}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeFilter === 'dish'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5" />
          Plats & Menus récents
        </button>
        <button
          onClick={() => setActiveFilter('recipe')}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeFilter === 'recipe'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          Pâtisserie & Douceurs
        </button>
        <button
          onClick={() => setActiveFilter('event')}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeFilter === 'event'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Événements & Traiteur
        </button>
        <button
          onClick={() => setActiveFilter('ambiance')}
          className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
            activeFilter === 'ambiance'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Ambiance & Décor
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. FEED CARDS LIST (Style Réseau Social Moderne)                           */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            id={`post-${post.id}`}
            className="bg-surface-container-lowest rounded-2xl border border-surface-container overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Header du post */}
              <div className="p-4 flex items-center justify-between border-b border-surface-container-low">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-container text-primary font-bold flex items-center justify-center text-sm shadow-sm overflow-hidden">
                    {restaurant.logo_url ? (
                      <img
                        src={restaurant.logo_url}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      restaurant.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-sm text-on-surface">
                        {restaurant.name}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-primary fill-primary/20" />
                      {post.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold border border-amber-500/20">
                          À la Une
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span>{post.createdAt}</span>
                      <span>•</span>
                      <span className="font-medium text-primary">
                        {getCategoryLabel(post.category)}
                      </span>
                    </div>
                  </div>
                </div>

                {post.price && (
                  <div className="text-right">
                    <span className="text-xs text-on-surface-variant block">Tarif</span>
                    <span className="font-bold text-sm text-primary">
                      {post.price.toLocaleString('fr-FR')} {post.currency || 'FCFA'}
                    </span>
                  </div>
                )}
              </div>

              {/* Titre & Description */}
              <div className="p-4 pb-3">
                <h3 className="font-bold text-base text-on-surface mb-1.5">
                  {post.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">
                  {post.description}
                </p>
              </div>

              {/* Média visuel (Image ou Vidéo) */}
              {post.mediaUrl && (
                <div className="relative bg-black aspect-video max-h-80 w-full overflow-hidden flex items-center justify-center">
                  {post.mediaType === 'video' ? (
                    <video
                      src={post.mediaUrl}
                      controls
                      className="w-full h-full object-contain"
                      playsInline
                    />
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              {/* Barre d'actions & compteurs */}
              <div className="px-4 py-3 border-y border-surface-container-low flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
                      post.isLiked ? 'text-red-500' : 'text-on-surface-variant hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    <span>{post.likesCount} J'aime</span>
                  </button>

                  <button
                    onClick={() =>
                      setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                    }
                    className="flex items-center gap-1.5 font-semibold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments.length} Avis & Questions</span>
                  </button>
                </div>

                <button
                  onClick={() => handleSharePost(post.id)}
                  className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  title="Copier le lien public de cette prestation"
                >
                  {copiedPostId === post.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Lien copié !</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>Partager</span>
                    </>
                  )}
                </button>
              </div>

              {/* Section Commentaires, Avis & Questions */}
              <div className="p-4 bg-surface-container-low/40 space-y-3">
                {post.comments.length === 0 ? (
                  <p className="text-xs text-on-surface-variant text-center py-2">
                    Aucun avis ou question pour le moment. Soyez le premier à commenter !
                  </p>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-surface-container-lowest p-3 rounded-xl border border-surface-container text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-on-surface">
                              {comment.authorName}
                            </span>
                            {comment.type === 'review' && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                {comment.rating}/5
                              </span>
                            )}
                            {comment.type === 'question' && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold flex items-center gap-1">
                                <HelpCircle className="w-3 h-3" />
                                Question
                              </span>
                            )}
                          </div>
                          <span className="text-on-surface-variant text-[11px]">
                            {comment.createdAt}
                          </span>
                        </div>

                        <p className="text-on-surface text-xs leading-relaxed">
                          {comment.content}
                        </p>

                        {/* Réponse du restaurant si déjà existante */}
                        {comment.restaurantReply ? (
                          <div className="mt-2 pl-3 border-l-2 border-primary bg-primary-container/20 p-2.5 rounded-r-lg space-y-1">
                            <div className="flex items-center gap-1.5 font-semibold text-primary text-[11px]">
                              <ChefHat className="w-3.5 h-3.5" />
                              <span>{comment.restaurantReply.authorName} (Équipe)</span>
                              <span className="text-on-surface-variant font-normal text-[10px] ml-auto">
                                {comment.restaurantReply.createdAt}
                              </span>
                            </div>
                            <p className="text-on-surface text-xs">
                              {comment.restaurantReply.content}
                            </p>
                          </div>
                        ) : !isPublicView ? (
                          // Bouton pour le restaurateur afin de répondre
                          <div>
                            {replyingToCommentId === comment.id ? (
                              <div className="mt-2 space-y-2 pl-2 border-l-2 border-primary">
                                <textarea
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder={`Répondre en tant que ${restaurant.name}...`}
                                  className="w-full text-xs p-2.5 rounded-lg border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                                  rows={2}
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setReplyingToCommentId(null)
                                      setReplyContent('')
                                    }}
                                    className="px-2.5 py-1 rounded-lg text-on-surface-variant hover:bg-surface-container text-xs cursor-pointer"
                                  >
                                    Annuler
                                  </button>
                                  <button
                                    onClick={() => handleReplyToComment(post.id, comment.id)}
                                    className="px-3 py-1 rounded-lg bg-primary text-on-primary font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <Send className="w-3 h-3" />
                                    Envoyer la réponse
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setReplyingToCommentId(comment.id)
                                  setReplyContent('')
                                }}
                                className="mt-1 inline-flex items-center gap-1 text-primary hover:underline font-semibold text-[11px] cursor-pointer"
                              >
                                <CornerDownRight className="w-3 h-3" />
                                Répondre au client
                              </button>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}

                {/* Formulaire pour ajouter un nouvel avis / commentaire / question */}
                {activeCommentPostId === post.id && (
                  <div className="mt-3 pt-3 border-t border-surface-container space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Votre nom (ex: Sandra K.)"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <select
                        value={commentType}
                        onChange={(e) =>
                          setCommentType(e.target.value as 'comment' | 'review' | 'question')
                        }
                        className="text-xs px-2 py-1.5 rounded-lg border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                      >
                        <option value="comment">Commentaire</option>
                        <option value="review">Avis & Note</option>
                        <option value="question">Question</option>
                      </select>
                    </div>

                    {commentType === 'review' && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-on-surface-variant mr-1">Votre note :</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setCommentRating(star)}
                            className="cursor-pointer"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                star <= commentRating
                                  ? 'fill-amber-500 text-amber-500'
                                  : 'text-surface-container-high'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={
                          commentType === 'question'
                            ? 'Posez une question sur ce plat...'
                            : commentType === 'review'
                            ? 'Partagez votre avis sur la dégustation...'
                            : 'Écrivez un commentaire...'
                        }
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddComment(post.id)
                          }
                        }}
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs inline-flex items-center gap-1 hover:bg-primary/90 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Publier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 4. MODAL DE PUBLICATION D'UNE RÉALISATION / PLAT NOUVEAU                   */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-surface-container-lowest rounded-2xl border border-surface-container w-full max-w-xl shadow-2xl overflow-hidden my-8">
            <div className="p-5 border-b border-surface-container flex items-center justify-between bg-surface-container-low/50">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-primary-container text-primary">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-on-surface">
                    Publier une réalisation ou un plat
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Ajoutez une photo, vidéo, description et tarif visible par tous les clients
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-2 rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-6 space-y-4 text-xs">
              {/* Titre */}
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block">
                  Titre du plat ou de la prestation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Filet de Capitaine braisé aux aromates du chef"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm"
                />
              </div>

              {/* Catégorie & Prix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Type de publication
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as 'dish' | 'event' | 'ambiance' | 'recipe'
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                  >
                    <option value="dish">Plat & Menu récent</option>
                    <option value="recipe">Pâtisserie & Dessert</option>
                    <option value="event">Événement & Prestation Traiteur</option>
                    <option value="ambiance">Ambiance & Décor</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Prix indicatif (Optionnel)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Ex : 8500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 pr-14 rounded-xl border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant font-medium">
                      FCFA
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block">
                  Description, ingrédients ou histoire de la création
                </label>
                <textarea
                  rows={3}
                  placeholder="Décrivez la texture, les saveurs, la méthode de cuisson ou les détails de la prestation événementielle..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs leading-relaxed"
                />
              </div>

              {/* Upload Média (Image ou Vidéo jusqu'à 100 Mo) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-on-surface block">
                  Photo ou Vidéo de la réalisation (Jusqu'à 100 Mo)
                </label>
                <div className="border-2 border-dashed border-surface-container hover:border-primary/50 rounded-xl p-4 text-center transition-colors bg-surface-container-low/30">
                  {mediaPreview ? (
                    <div className="space-y-2">
                      {mediaFile?.type.startsWith('video/') ? (
                        <video
                          src={mediaPreview}
                          controls
                          className="max-h-48 mx-auto rounded-lg"
                        />
                      ) : (
                        <img
                          src={mediaPreview}
                          alt="Aperçu"
                          className="max-h-48 mx-auto rounded-lg object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFile(null)
                          setMediaPreview(null)
                        }}
                        className="px-3 py-1 rounded-lg bg-error-container text-error text-xs font-semibold cursor-pointer inline-flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Supprimer ce média
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block space-y-2">
                      <div className="w-10 h-10 mx-auto rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div className="text-xs">
                        <span className="font-semibold text-primary">
                          Cliquez pour importer
                        </span>{' '}
                        ou glissez-déposez
                      </div>
                      <p className="text-[11px] text-on-surface-variant">
                        Images (PNG, JPG, WebP) ou Vidéos (MP4, WebM) • Max 100 Mo
                      </p>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleMediaChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Mettre en avant */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeaturedCheck"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isFeaturedCheck"
                  className="font-medium text-on-surface cursor-pointer text-xs"
                >
                  Mettre en avant cette réalisation en tête du flux (Badge "À la Une")
                </label>
              </div>

              {/* Actions du Modal */}
              <div className="pt-4 border-t border-surface-container flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-surface-container text-on-surface hover:bg-surface-container font-semibold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary/90 font-semibold transition-all shadow-sm cursor-pointer inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    'Publication en cours...'
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Publier immédiatement
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
