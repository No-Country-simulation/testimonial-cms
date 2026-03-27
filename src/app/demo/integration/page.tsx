export default function IntegrationDemoPage() {
  const iframeSnippet = `<iframe\n  src="http://localhost:3000/embed/testimonials?category=CLIENTE&limit=4"\n  width="100%"\n  height="900"\n  style="border:0; border-radius:16px;"\n  loading="lazy"\n></iframe>`

  const apiSnippet = `fetch('http://localhost:3000/api/public/testimonials?category=CLIENTE&limit=4')\n  .then(r => r.json())\n  .then(console.log)`

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Demo de integración externa</h1>
      <p className="text-gray-500">Ejemplos para insertar testimonios en otra web por iframe o API pública.</p>

      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Snippet iframe</h2>
        <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-4 overflow-auto">{iframeSnippet}</pre>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-2">Snippet API pública</h2>
        <pre className="text-xs bg-gray-50 border border-gray-100 rounded-lg p-4 overflow-auto">{apiSnippet}</pre>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Preview del embed</h2>
        <iframe
          src="/embed/testimonials?category=CLIENTE&limit=4"
          className="w-full h-[900px] border border-gray-100 rounded-2xl"
          loading="lazy"
        />
      </section>
    </div>
  )
}
