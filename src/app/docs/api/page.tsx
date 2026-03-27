export default function ApiDocsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentación API REST</h1>
        <p className="text-gray-500">Testimonial CMS · Endpoints para administración, consumo público e integraciones.</p>
      </header>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Autenticación y roles</h2>
        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>POST /api/auth/login — body: username (admin|editor), password</li>
          <li>POST /api/auth/logout</li>
          <li>Roles disponibles: ADMIN, EDITOR y VISITOR (público)</li>
          <li>DELETE de testimonios: solo ADMIN</li>
        </ul>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Testimonios (privado)</h2>
        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>GET /api/testimonials?q=&category=&approved=</li>
          <li>POST /api/testimonials</li>
          <li>GET /api/testimonials/:id</li>
          <li>PUT /api/testimonials/:id</li>
          <li>DELETE /api/testimonials/:id</li>
        </ul>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Testimonios (público / embeds)</h2>
        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>GET /api/public/testimonials?category=&tag=&q=&limit=</li>
          <li>Página iframe: /embed/testimonials?category=CLIENTE&limit=6</li>
        </ul>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3">
        <h2 className="text-xl font-semibold">Integraciones multimedia</h2>
        <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
          <li>YouTube Data API: GET /api/integrations/youtube?video=URL_O_ID</li>
          <li>Cloudinary: usa imageUrl o cloudinaryPublicId en testimonios</li>
          <li>Variables: YOUTUBE_API_KEY, CLOUDINARY_CLOUD_NAME</li>
        </ul>
      </section>
    </div>
  )
}
