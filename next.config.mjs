/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para produção
  experimental: {
    outputFileTracingRoot: process.cwd(),
  },
  
  // Configurações de imagem para produção
  images: {
    unoptimized: true,
  },
  
  // Configurações de build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configurações de TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações de output para deploy estático (se necessário)
  ...(process.env.STATIC_EXPORT === 'true' && {
    output: 'export',
    trailingSlash: true,
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;

