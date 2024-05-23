/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar el modo estricto de React para ayudar a identificar problemas potenciales en la aplicación
  reactStrictMode: true,

  // Definir configuraciones de internacionalización si se necesitan múltiples idiomas
  i18n: {
    locales: ["en", "es"], // Agrega los locales que necesites
    defaultLocale: "en", // Define el locale por defecto
  },

  // Configurar los encabezados para las respuestas HTTP
  async headers() {
    return [
      {
        source: "/(.*)", // Aplica los encabezados a todas las rutas
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'none';",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};
