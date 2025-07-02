# WaveStudio

Suite de Rocketbot para la creación, despliegue, integración y monitoreo de agentes digitales conversacionales, apalancados en LLMs públicos, con interfaces innovadoras y fuerte enfoque en automatización, interoperabilidad e insights operativos.

## Estructura del MVP
- **Pantalla de carga animada** con logo de WaveStudio
- **Dashboard principal** con navegación moderna
- **Módulos:**
  - 🧠 WaveBuilder
  - 💬 WaveLive
  - 🧩 WavePrompt
  - 🔌 WaveBridge
  - 📈 WaveInsights
  - 🌐 WaveDeploy

## Integración Supabase
- Listo para conectar con Supabase (tabla: `logs_agente`)
- Todos los módulos pueden consumir datos en tiempo real desde esta tabla

## Stack
- Next.js 14 (App Router, TypeScript)
- TailwindCSS (estilo innovador y tecnológico)
- Supabase JS Client

## Comenzar
```bash
npm install
npm run dev
```

## Personalización
- Modifica los módulos en `/src/app/`
- El layout y navegación están en `/src/app/layout.tsx`
- La pantalla de carga se puede personalizar en el mismo layout

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
