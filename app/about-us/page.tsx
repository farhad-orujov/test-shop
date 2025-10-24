import Image from 'next/image';

export default function AboutUsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-zinc-600 mb-4">
            Welcome to TestShop — your go-to online store for quality footwear and accessories. We curate a selection of the best brands and styles, and focus on comfort, performance and design.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Our mission</h2>
          <p className="text-zinc-600 mb-4">
            To provide customers with a curated selection of footwear that combines style and performance, backed by excellent customer service and fast delivery.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Contact</h2>
          <ul className="text-zinc-600">
            <li>Email: TestShop@gmail.com</li>
            <li>Phone: +994 77 777 777</li>
            <li>Address: Baku (Online store)</li>
          </ul>
        </div>
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-xl overflow-hidden shadow-lg">
            <Image src="/clothings/shoes/shoe1.jpg" alt="Store" width={800} height={600} className="w-full h-auto object-cover" />
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Why choose us</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold mb-2">Curated selection</h4>
            <p className="text-zinc-600">Top brands, hand-picked for quality and style.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold mb-2">Fast delivery</h4>
            <p className="text-zinc-600">Quick shipping and reliable tracking.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h4 className="font-semibold mb-2">Customer support</h4>
            <p className="text-zinc-600">Friendly help when you need it.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
