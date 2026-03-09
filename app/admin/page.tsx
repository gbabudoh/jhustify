'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRootRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#6d6e6b]/20 border-t-[#6d6e6b] rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Entering Command Center...</p>
      </div>
    </div>
  );
}
