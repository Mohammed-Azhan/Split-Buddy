"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from 'next-auth/react';
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Palette,
  Users,
  Cloud,
  ShieldCheck,
  Github,
} from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const params = useSearchParams();
  const router = useRouter();


  useEffect(() => {
    const message = params.get("message");
    const error = params.get("error");
    if (message === "userexists" || error === "userexists") {
      setAlert({ message: "User already exists with that email", type: "warning" });
    }

    else if (message === "verificationsuccess") {
      setAlert({ message: "Account verified successfully , please login to continue .", type: "success" });
    }
    else if (message === "successreset") {
      setAlert({ message: "An email is sent to your inbox , please verify your email to reset your password", type: "success" });
    }
  }, [params]);





  const handleGoogleAuth = () => {

    const res = signIn("google",
      {
        callbackUrl: '/dashboard',
      }
    );

  }

  const handleSignin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", { redirect: false, email, password })
      console.log(res);
      if (res.error) {
        toast.warning(res.error);
      }
      else{
        return router.push('/dashboard');

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
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
                <Alert type={alert.type} message={alert.message}></Alert>
              </div> : null}
              <div className="mx-auto w-full max-w-md">
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold text-black uppercase">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">
                    Sign in to continue your creative journey
                  </p>
                </div>

                <form className="space-y-6 text-black">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium uppercase">
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

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-medium uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-400 outline-none bg-input block w-full rounded-lg border py-3 pr-12 pl-10 text-sm"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                        onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-muted-foreground flex items-center text-sm">
                      <input
                        type="checkbox"
                        className="border-border text-primary h-4 w-4 rounded"
                      />
                      <span className="ml-2">Remember me</span>
                    </label>
                    <a
                      href="#"
                      className="text-primary hover:text-primary/80 text-sm">
                      Forgot password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    onClick={handleSignin}
                    className="bg-teal-500 cursor-pointer relative flex w-full items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white transition-all duration-300"
                    disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="ml-2">Just a moment...</span>
                      </>
                    ) : (
                      "Sign in to your account"
                    )}
                  </button>

                  <div className="flex items-center gap-4 my-6">
                    <hr className="flex-1 border-t border-gray-300" />
                    <span className="text-gray-500 text-sm">Or sign in with google</span>
                    <hr className="flex-1 border-t border-gray-300" />
                  </div>


                  <div className="grid gap-3">
                    <button
                      onClick={handleGoogleAuth}
                      type="button"
                      className="text-black bg-secondary text-foreground hover:bg-secondary/80 flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm shadow-sm">
                      <img
                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                        className="h-5 w-5"
                        alt="Google"
                      />
                      <span className="ml-2 text-black">Google</span>
                    </button>

                  </div>
                </form>

                <div className="text-muted-foreground mt-8 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="text-primary hover:text-primary/80">
                    Sign up for free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}