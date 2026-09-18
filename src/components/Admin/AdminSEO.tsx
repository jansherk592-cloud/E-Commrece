import React, { useState } from 'react';
import {
  Search,
  Globe,
  Share2,
  Code,
  FileText,
  Download,
  CheckCircle,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminSEO: React.FC = () => {
  const { businessInfo, products, showToast } = useStore();
  const [selectedProductSlug, setSelectedProductSlug] = useState<string>(products[0]?.slug || '');

  const activeProduct = products.find((p) => p.slug === selectedProductSlug) || products[0];

  const siteUrl = 'https://apexcommerce.demo';
  const pageTitle = activeProduct
    ? `${activeProduct.name} | ${businessInfo.name}`
    : `${businessInfo.name} | Professional High-Performance Electronics`;
  const pageDesc = activeProduct
    ? activeProduct.description
    : `${businessInfo.tagline}. Order direct with express delivery, 2-year warranty, and instant WhatsApp customer support.`;

  const structuredData = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: activeProduct?.name || businessInfo.name,
    image: activeProduct?.images || [businessInfo.logoUrl],
    description: pageDesc,
    sku: activeProduct?.sku || 'APX-GEN-01',
    brand: {
      '@type': 'Brand',
      name: businessInfo.name,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${activeProduct?.slug}`,
      priceCurrency: 'USD',
      price: activeProduct?.discountPrice || activeProduct?.price || 199.0,
      availability: activeProduct && activeProduct.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: activeProduct?.rating || 4.9,
      reviewCount: activeProduct?.reviewCount || 128,
    },
  };

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${siteUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
${products
  .map(
    (p) => `  <url>
    <loc>${siteUrl}/products/${p.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: ${siteUrl}/sitemap.xml`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied', `${label} copied to clipboard.`, 'success');
  };

  const downloadFile = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Downloaded', `${filename} generated successfully.`, 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in text-xs">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">SEO, OpenGraph & Indexing Suite</h2>
        <p className="text-stone-500">
          Verify how Google Search engines and social media networks index your store, product schemas, and sitemaps.
        </p>
      </div>

      {/* Product Selector for Preview */}
      <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-stone-400" />
          <span className="font-bold text-stone-800">Select Item to Audit SEO:</span>
        </div>
        <select
          value={selectedProductSlug}
          onChange={(e) => setSelectedProductSlug(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white font-medium"
        >
          {products.map((p) => (
            <option key={p.id} value={p.slug}>
              {p.name} (${p.discountPrice ?? p.price})
            </option>
          ))}
        </select>
      </div>

      {/* Grid: Google Search Snippet Preview & Social Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Google SERP Snippet */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-600" /> Google Search SERP Snippet Preview
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              Mobile & Desktop Indexed
            </span>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 font-sans space-y-1">
            <div className="flex items-center space-x-2 text-stone-600 text-[11px]">
              <div className="w-4 h-4 rounded-full bg-stone-900 text-white flex items-center justify-center text-[9px] font-bold">
                A
              </div>
              <span className="truncate">{siteUrl} › products › {activeProduct?.slug}</span>
            </div>
            <h4 className="text-base text-blue-800 font-medium hover:underline cursor-pointer leading-snug">
              {pageTitle}
            </h4>
            <div className="flex items-center space-x-1 text-amber-600 text-xs my-0.5">
              <span>★★★★★</span>
              <span className="font-bold text-stone-700">{activeProduct?.rating}</span>
              <span className="text-stone-400">({activeProduct?.reviewCount})</span>
              <span className="text-stone-300">•</span>
              <span className="font-bold text-stone-800">
                ${activeProduct?.discountPrice ?? activeProduct?.price} USD
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-emerald-700 font-medium">In stock</span>
            </div>
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">{pageDesc}</p>
          </div>
        </div>

        {/* Social Card Preview */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <Share2 className="w-4 h-4 text-indigo-600" /> OpenGraph & Social Card Preview
            </span>
            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
              WhatsApp / iMessage / Twitter
            </span>
          </div>

          <div className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50">
            <img
              src={activeProduct?.images[0]}
              alt={activeProduct?.name}
              className="w-full h-40 object-cover bg-stone-100"
            />
            <div className="p-3.5 space-y-1 bg-white border-t border-stone-200">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                apexcommerce.demo
              </span>
              <h5 className="font-bold text-stone-900 text-xs truncate">{pageTitle}</h5>
              <p className="text-[11px] text-stone-500 line-clamp-1">{pageDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD Schema Viewer */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Code className="w-4 h-4 text-emerald-600" /> Real-time Schema.org (JSON-LD)
          </span>
          <button
            onClick={() => copyToClipboard(JSON.stringify(structuredData, null, 2), 'JSON-LD Schema')}
            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 rounded-lg font-bold text-stone-700 flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Schema</span>
          </button>
        </div>
        <pre className="p-4 bg-stone-900 text-emerald-400 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed max-h-64">
          {JSON.stringify(structuredData, null, 2)}
        </pre>
      </div>

      {/* Sitemap & Robots.txt Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sitemap.xml */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-600" /> Dynamic sitemap.xml
            </span>
            <button
              onClick={() => downloadFile(sitemapXml, 'sitemap.xml', 'application/xml')}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>
          <pre className="p-3 bg-stone-50 border border-stone-200 rounded-xl overflow-x-auto text-[10px] font-mono text-stone-700 max-h-48">
            {sitemapXml}
          </pre>
        </div>

        {/* Robots.txt */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <span className="font-bold text-stone-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-stone-600" /> Crawl Policy robots.txt
            </span>
            <button
              onClick={() => downloadFile(robotsTxt, 'robots.txt', 'text/plain')}
              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              <span>Download</span>
            </button>
          </div>
          <pre className="p-3 bg-stone-50 border border-stone-200 rounded-xl overflow-x-auto text-[10px] font-mono text-stone-700 max-h-48">
            {robotsTxt}
          </pre>
        </div>
      </div>
    </div>
  );
};
