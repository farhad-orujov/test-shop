'use client'
import { use } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { beniga } from '@/app/fonts'
import clsx from 'clsx'

interface ProductData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  tags: string[];
}

export default function ItemPage({
  params,
}: {
  params: Promise<{ item: string }>
}) {
  const { item } = use(params)
  const searchParams = useSearchParams()
  
  // Получаем данные из URL
  const dataParam = searchParams.get('data')
  let productData: ProductData | null = null
  
  if (dataParam) {
    try {
      productData = JSON.parse(decodeURIComponent(dataParam))
    } catch (error) {
      console.error('Error parsing product data:', error)
    }
  }

  // Заглушка если данные не переданы
  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className={clsx("text-2xl font-bold", beniga.className)}>
          Товар не найден
        </h1>
        <p>ID: {item}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Изображение товара */}
        <div className="relative w-full aspect-[7/5] bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={productData.image}
            alt={productData.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Информация о товаре */}
        <div className="space-y-4">
          <h1 className={clsx("text-3xl font-bold uppercase", beniga.className)}>
            {productData.name}
          </h1>
          
          {/* Теги */}
          {productData.tags.length > 0 && (
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
              Добавить в корзину
            </button>
            <button className="w-full border border-rose-500 text-rose-500 py-3 px-6 rounded-lg hover:bg-rose-50 transition-colors">
              Добавить в избранное
            </button>
          </div>

          {/* Описание */}
          <div className="pt-4">
            <h3 className={clsx("text-lg font-semibold mb-2", beniga.className)}>
              Описание
            </h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}