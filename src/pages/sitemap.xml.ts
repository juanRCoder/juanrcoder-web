import type { APIRoute } from "astro";

// Genera /sitemap.xml a partir de las páginas .astro/.md en src/pages.
// Excluye rutas dinámicas ([slug]), páginas privadas (_archivo) y endpoints.
const pages = import.meta.glob("./**/*.{astro,md,mdx}");

const toPath = (file: string) =>
  file
    .replace(/^\.\//, "/")
    .replace(/\.(astro|md|mdx)$/, "")
    .replace(/\/index$/, "/")
    .replace(/^\/$/, "/");

export const GET: APIRoute = ({ site }) => {
  if (!site) throw new Error("Define `site` en astro.config para generar el sitemap.");

  const lastmod = new Date().toISOString().split("T")[0];
  const urls = Object.keys(pages)
    .filter((f) => !/\[|\/_/.test(f))
    .map(toPath)
    .sort()
    .map((path) => {
      const loc = new URL(path, site).href;
      const priority = path === "/" ? "1.0" : "0.8";
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
