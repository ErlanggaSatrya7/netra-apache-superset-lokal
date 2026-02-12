"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowRight, Zap } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Menambahkan state password
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Memanggil API Login asli yang terhubung ke database
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(
          `Selamat Datang, ${data.role === "admin" ? "Direktur" : "Staff"}`
        );

        // Redirect berdasarkan role yang dikirim dari database
        if (data.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/staff/upload");
        }
      } else {
        // Menampilkan pesan error jika email/password salah
        toast.error(data.message || "Login Gagal");
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server database");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />
        <CardHeader className="space-y-2 text-center pt-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
            <Zap className="h-8 w-8 text-white fill-white" />
          </div>
          <CardTitle className="text-4xl font-black tracking-tighter text-white uppercase italic">
            DATAVORTEX
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium italic">
            Portal PT Netra Vidya Analitika
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2 text-white">
              <Label>Email Perusahaan</Label>
              <Input
                type="email"
                placeholder="angga@netra.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-slate-950 border-slate-800"
              />
            </div>
            <div className="space-y-2 text-white">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-slate-950 border-slate-800"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-7 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>MEMVERIFIKASI...</span>
                </div>
              ) : (
                <>
                  LOGIN SISTEM <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { Loader2, ArrowRight, Zap } from "lucide-react";

// export default function LoginPage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setTimeout(() => {
//       setIsLoading(false);
//       if (email.toLowerCase().includes("admin")) {
//         toast.success("Login Berhasil sebagai Direktur");
//         router.push("/admin");
//       } else {
//         toast.success("Login Berhasil sebagai Staff");
//         router.push("/staff/upload");
//       }
//     }, 1500);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4">
//       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
//       <Card className="w-full max-w-md border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
//         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-400" />
//         <CardHeader className="space-y-2 text-center pt-8">
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]">
//             <Zap className="h-8 w-8 text-white fill-white" />
//           </div>
//           <CardTitle className="text-4xl font-black tracking-tighter text-white uppercase italic">
//             DATAVORTEX
//           </CardTitle>
//           <CardDescription className="text-slate-400 font-medium italic">
//             Portal PT Netra Vidya Analitika
//           </CardDescription>
//         </CardHeader>
//         <form onSubmit={handleLogin}>
//           <CardContent className="space-y-6 pt-4">
//             <div className="space-y-2 text-white">
//               <Label>Email Perusahaan</Label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="bg-slate-950 border-slate-800"
//               />
//             </div>
//             <div className="space-y-2 text-white">
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 required
//                 className="bg-slate-950 border-slate-800"
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4 pb-8">
//             <Button
//               className="w-full bg-blue-600 font-bold py-7 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <Loader2 className="animate-spin" />
//               ) : (
//                 <>
//                   LOGIN SISTEM <ArrowRight className="ml-2 h-5 w-5" />
//                 </>
//               )}
//             </Button>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   );
// }
