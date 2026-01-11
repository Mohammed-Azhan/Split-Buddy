import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-indigo-600 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <h3 className="text-white text-xl font-semibold">Split Buddy</h3>
          <p className="mt-3 text-sm text-neutral-200 max-w-xs">
            Split expenses, track balances, and stay clear with friends.
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-white font-medium mb-4">Product</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="#how-it-works" className="hover:text-indigo-400 transition">
                How it works
              </Link>
            </li>
            <li>
              <Link href="#features" className="hover:text-indigo-400 transition">
                Features
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-indigo-400 transition">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-medium mb-4">Support</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/contact" className="hover:text-indigo-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-indigo-400 transition">
                Help
              </Link>
            </li>
            <li>
              <Link href="/feedback" className="hover:text-indigo-400 transition">
                Send feedback
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-neutral-300">
          <span>© {new Date().getFullYear()} Split Buddy</span>

          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-indigo-400 transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-indigo-400 transition">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
