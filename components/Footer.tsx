'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#D6D9DD] py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d3f5ce] to-[#D9F8D4] flex items-center justify-center">
                <span className="text-[#6d6e6b] font-bold">J</span>
              </div>
              <span className="text-lg font-bold text-[#6d6e6b]">Jhustify</span>
            </div>
            <p className="text-sm text-gray-600">
              Mapping Africa&apos;s Trust Economy
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#6d6e6b] mb-3">For Businesses</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/verify" className="hover:text-[#6d6e6b]">Get Verified</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#6d6e6b]">Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-[#6d6e6b]">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#6d6e6b] mb-3">For Customers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/search" className="hover:text-[#6d6e6b]">Search Businesses</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[#6d6e6b]">How it Works</Link></li>
              <li><Link href="/about" className="hover:text-[#6d6e6b]">About</Link></li>
              <li><Link href="/contact" className="hover:text-[#6d6e6b]">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-[#6d6e6b] mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/terms" className="hover:text-[#6d6e6b]">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-[#6d6e6b]">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#D6D9DD] pt-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Jhustify. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

