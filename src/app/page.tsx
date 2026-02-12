// Versi 3

import { redirect } from "next/navigation";

/**
 * FILE: src/app/page.tsx
 * DESKRIPSI: Root page yang berfungsi mengalihkan trafik ke halaman login.
 */
export default function RootPage() {
  // Langsung pindah ke /login secara instan (Server-side redirect)
  redirect("/login");

  // Tidak merender apa pun karena sudah dialihkan
  return null;
}

// // versi 2

// "use client";

// import { useRouter } from "next/navigation"; // Import ini

// export default function LoginPage() {
//   const router = useRouter(); // Inisialisasi router

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-100">
//       <div className="p-8 bg-white shadow-lg rounded-lg border border-slate-200 text-center">
//         <h1 className="text-2xl font-bold text-slate-900">DataVortex Login</h1>
//         <p className="text-slate-500">PT Netra Vidya Analitika</p>

//         {/* Tombol ini sekarang mengarah ke file login keren kamu */}
//         <button
//           onClick={() => router.push("/login")}
//           className="mt-6 w-full px-4 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
//         >
//           Masuk ke Portal Sistem
//         </button>
//       </div>
//     </div>
//   );
// }

// "use client";

// // Pastikan ada kata 'export default' di depan function
// export default function LoginPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-slate-100">
//       <div className="p-8 bg-white shadow-lg rounded-lg border border-slate-200">
//         <h1 className="text-2xl font-bold text-slate-900">DataVortex Login</h1>
//         <p className="text-slate-500">PT Netra Vidya Analitika</p>
//         <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
//           Masuk
//         </button>
//       </div>
//     </div>
//   );
// }
