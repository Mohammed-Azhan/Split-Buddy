"use client";
import { useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  User,
  EyeOff,
  Loader2,
  Palette,
  Users,
  Cloud,
  ShieldCheck,
  Github,
} from "lucide-react";
import Alert from "../../components/mvpblocks/Alert";
import { useRouter } from "next/navigation";
export default function Page() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const router = useRouter();




  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/resetPassword', { email });
      if (!response.data.status) {
        setAlert({ message: response.data.message, type: response.data.type });
      }
      if (response.data.status && response.data.message === "success") {
        return router.push('/signin?message=successreset')
      }

    }
    catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
      <style jsx>{`
        .login-btn {
          position: relative;
          overflow: hidden;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }
        .login-btn:hover::before {
          left: 100%;
        }
      `}</style>
      <div className="z-10 w-full max-w-6xl">
        <div className="bg-secondary/50 overflow-hidden rounded-[40px] shadow-2xl">
          <div className="grid min-h-[700px] lg:grid-cols-2">
            {/* Left Side */}
            <div className="brand-side relative m-4 rounded-3xl bg-[url('https://cdn.midjourney.com/299f94f9-ecb9-4b26-bead-010b8d8b01d9/0_0.webp?w=800&q=80')] bg-cover p-12 text-white">
              <div>
                <div className="mb-12 text-lg font-semibold uppercase">
                  PixelForge Studio
                </div>
                <h1 className="mb-4 text-6xl font-medium">
                  Create, Design, and Innovate
                </h1>
                <p className="mb-12 text-xl opacity-80">
                  Join thousands of creators who trust PixelForge Studio to
                  bring their vision to life
                </p>

                <div className="space-y-6">
                  {[
                    {
                      icon: <Palette size={16} />,
                      title: "Advanced Design Tools",
                      desc: "Professional-grade tools for every project",
                    },
                    {
                      icon: <Users size={16} />,
                      title: "Team Collaboration",
                      desc: "Work together seamlessly in real-time",
                    },
                    {
                      icon: <Cloud size={16} />,
                      title: "Cloud Storage",
                      desc: "Access your projects from anywhere",
                    },
                    {
                      icon: <ShieldCheck size={16} />,
                      title: "Enterprise Security",
                      desc: "Bank-level security for your data",
                    },
                  ].map(({ icon, title, desc }, i) => (
                    <div
                      key={i}
                      className="feature-item animate-fadeInUp flex items-center"
                      style={{ animationDelay: `${0.2 * (i + 1)}s` }}>
                      <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur-sm">
                        {icon}
                      </div>
                      <div>
                        <div className="font-semibold">{title}</div>
                        <div className="text-sm opacity-70">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col justify-center p-12">
              {alert ? <div className="p-4">
                <Alert message={alert.message} type={alert.type}></Alert>
              </div> : null}
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-black uppercase">
                    Reset your password
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    After submitting the email you will recieve a link to reset your password
                  </p>
                </div>

                <form className="space-y-6 text-black">



                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm text-gray-700 font-medium uppercase">
                      Email address
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-input dark:bg-input block w-full rounded-lg border border-gray-400 outline-none py-3 pr-3 pl-10 text-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>


                  <button
                    type="submit"
                    onClick={handleReset}
                    className="bg-teal-500 login-btn cursor-pointer relative flex w-full items-center justify-center rounded-lg px-4 py-3 mt-8 text-sm font-medium text-white transition-all duration-300"
                    disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Just a moment ...</span>
                      </>
                    ) : (
                      "Get link"
                    )}
                  </button>

                </form>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}