'use client'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { beniga } from '@/app/fonts'
import clsx from 'clsx'
import { useState, useEffect, FormEvent } from 'react'

interface ColorVariant {
  colorName: string;
  colorCode: string;
  image: string;
}

interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  tags: string[];
  colorVariants?: ColorVariant[];
  description?: string;
}

export default function ItemPage({
  params,
}: {
  params: Promise<{ item: string }>
}) {
  const { item } = use(params)
  const searchParams = useSearchParams()
  
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Состояние для выбранного цвета
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null)

  // Загрузка данных с сервера
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/products/${item}`)
        
        if (!response.ok) {
          throw new Error('Product not found')
        }
        
        const data = await response.json()
        setProductData(data)
        
        // Устанавливаем первый вариант цвета по умолчанию
        if (data.colorVariants && data.colorVariants.length > 0) {
          setSelectedVariant(data.colorVariants[0])
        }
      } catch (err) {
  setError(err instanceof Error ? err.message : 'An error occurred while loading the product')
      } finally {
        setLoading(false)
      }
    }

    if (item) {
      fetchProduct()
    }
  }, [item])

  // Состояние загрузки
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="w-full aspect-[7/5] bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Состояние ошибки
  if (error || !productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className={clsx("text-2xl font-bold text-red-500", beniga.className)}>
            {error || 'Товар не найден'}
          </h1>
          <p className="text-gray-600 mt-2">ID: {item}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    )
  }

  // Определяем основное изображение
  const displayImage = selectedVariant?.image || productData.image

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Изображение товара */}
        <div className="relative w-full aspect-[7/5] bg-gray-100 rounded-lg overflow-hidden">
          {displayImage && typeof displayImage === 'string' && displayImage.startsWith('data:') ? (
            // Data URIs cause the Next.js image optimizer to return 400 in production.
            // Use a plain <img> tag for inline/base64 images.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayImage} alt={productData.name} className="w-full h-full object-cover" />
          ) : (
            <Image
              src={displayImage || '/placeholder-color.jpg'}
              alt={productData.name}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>

        {/* Информация о товаре */}
        <div className="space-y-4">
          <h1 className={clsx("text-3xl font-bold uppercase", beniga.className)}>
            {productData.name}
          </h1>
          
          {/* Теги */}
          {productData.tags && productData.tags.length > 0 && (
            <div className="flex gap-2">
              {productData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-rose-500 text-white text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Варианты цвета */}
          {productData.colorVariants && productData.colorVariants.length > 0 && (
            <div>
              <h3 className={clsx("text-sm font-medium mb-2", beniga.className)}>
                Color: {selectedVariant?.colorName || 'Choose a color'}
              </h3>
              <div className="flex gap-2">
                {productData.colorVariants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedVariant(variant)}
                    className={clsx(
                      "w-8 h-8 border-2 transition-all",
                      selectedVariant?.colorCode === variant.colorCode 
                        ? "border-rose-500 scale-110" 
                        : "border-gray-300 hover:border-gray-400"
                    )}
                    style={{ backgroundColor: variant.colorCode }}
                    title={variant.colorName}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Рейтинг */}
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-lg ${i < productData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-600">({productData.rating})</span>
          </div>

          {/* Цена */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-rose-500">
                {productData.price} AZN
              </span>
              {productData.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {productData.originalPrice} USD
                </span>
              )}
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="space-y-3 pt-4">
            <button className="w-full bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600 transition-colors">
              Add to cart
            </button>
            <button className="w-full border border-rose-500 text-rose-500 py-3 px-6 rounded-lg hover:bg-rose-50 transition-colors">
              Add to favorites
            </button>
          </div>

          {/* Описание */}
          {productData.description && (
            <div className="pt-4">
              <h3 className={clsx("text-lg font-semibold mb-2", beniga.className)}>
                Description
              </h3>
              <p className="text-gray-600">
                {productData.description}
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Comments section (intentionally vulnerable to XSS for CTF) */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <CommentBox productId={item} />
      </div>
    </div>
  )
}

function CommentBox({ productId }: { productId: string }) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [clientId, setClientId] = useState<string | null>(null);

  const fetchComments = async (id?: string | null) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('productId', productId);
      if (id) params.set('clientId', id);
      const res = await fetch(`/api/comments?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // assign a per-client id stored in localStorage so comments are scoped to this client
    let id = null;
    try {
      id = localStorage.getItem('ctf_client_id');
      if (!id) {
        id = 'client_' + Math.random().toString(36).slice(2, 11);
        localStorage.setItem('ctf_client_id', id);
      }
    } catch (e) {
      // ignore localStorage errors
    }
    setClientId(id);
  }, []);

  useEffect(() => { if (clientId) fetchComments(clientId); }, [productId, clientId]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const id = clientId || (typeof localStorage !== 'undefined' ? localStorage.getItem('ctf_client_id') : null);
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, author, content, clientId: id })
      });
      if (res.ok) {
        setAuthor(''); setContent('');
        fetchComments();
      } else {
        console.error('Failed to post comment', await res.text());
      }
    } catch (err) {
      console.error(err);
    }
  };

  // After comments are loaded, execute any stored <script> tags so the lab behaves like
  // a classic stored-XSS vulnerable app (browsers do not execute scripts inserted via
  // innerHTML automatically, so we re-insert them to trigger execution).
  useEffect(() => {
    // small timeout to ensure DOM is updated
    const t = setTimeout(() => {
      try {
        const containers = document.querySelectorAll('[data-comment-content]');
        containers.forEach((el) => {
          // execute inline scripts
          const scripts = el.querySelectorAll('script');
          scripts.forEach((s) => {
            const newScript = document.createElement('script');
            // copy attributes if any
            for (let i = 0; i < s.attributes.length; i++) {
              const attr = s.attributes[i];
              newScript.setAttribute(attr.name, attr.value);
            }
            newScript.text = s.textContent || '';
            // append and remove to trigger execution
            document.body.appendChild(newScript);
            document.body.removeChild(newScript);
          });
        });
      } catch (e) {
        // ignore
      }
    }, 50);

    return () => clearTimeout(t);
  }, [comments]);

  return (
    <div className="max-w-2xl">
      <form onSubmit={submit} className="space-y-2 mb-6">
        <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Name (optional)" className="w-full p-2 rounded bg-zinc-800 text-white" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Your comment (HTML allowed)" rows={4} className="w-full p-2 rounded bg-zinc-800 text-white" />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-rose-600 text-white rounded">Post comment</button>
        </div>
      </form>

      {loading && <div>Loading comments...</div>}

      <div className="space-y-4">
  {/* Hidden CTF flag for easy challenge */}
  {/* Hidden admin account name for brute-force challenge */}
  <div id="ctf-admin" style={{ display: 'none' }}>CodeAcademyAdmin92658</div>

        {comments.map((c) => (
          <div key={c._id} className="p-3 border rounded bg-white text-black">
            <div className="text-sm text-zinc-500 mb-2">{c.author || 'anonymous'} — {new Date(c.createdAt).toLocaleString()}</div>
            {/* Intentionally render raw HTML (vulnerable to stored XSS) */}
            <div data-comment-content dangerouslySetInnerHTML={{ __html: c.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}