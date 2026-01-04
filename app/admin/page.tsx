'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, Building2, ShieldCheck, MessageSquare, Star, 
  CreditCard, Image, BarChart3, Settings, AlertCircle 
} from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    users: 0,
    businesses: 0,
    verifications: 0,
    messages: 0,
    ratings: 0,
    subscriptions: 0,
    banners: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = () => {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!userStr || !token) {
          router.push('/admin/login');
          return false;
        }
        
        try {
          const parsedUser = JSON.parse(userStr);
          if (parsedUser.role !== 'ADMIN') {
            router.push('/');
            return false;
          }
          setUser(parsedUser);
          return true;
        } catch (e) {
          router.push('/admin/login');
          return false;
        }
      }
      return false;
    };

    if (checkAdmin()) {
      fetchStats();
    }
  }, [router]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const adminModules = [
    {
      title: 'Users',
      description: 'Manage all platform users',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
      count: stats.users,
    },
    {
      title: 'Businesses',
      description: 'Manage business listings',
      icon: Building2,
      href: '/admin/businesses',
      color: 'bg-green-500',
      count: stats.businesses,
    },
    {
      title: 'Verifications',
      description: 'Review and manage verifications',
      icon: ShieldCheck,
      href: '/admin/verifications',
      color: 'bg-purple-500',
      count: stats.verifications,
    },
    {
      title: 'Messages',
      description: 'View all messages',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-orange-500',
      count: stats.messages,
    },
    {
      title: 'Ratings',
      description: 'Manage ratings and reviews',
      icon: Star,
      href: '/admin/ratings',
      color: 'bg-yellow-500',
      count: stats.ratings,
    },
    {
      title: 'Subscriptions',
      description: 'Manage subscriptions',
      icon: CreditCard,
      href: '/admin/subscriptions',
      color: 'bg-indigo-500',
      count: stats.subscriptions,
    },
    {
      title: 'Banners',
      description: 'Manage promotional banners',
      icon: Image,
      href: '/admin/banners',
      color: 'bg-pink-500',
      count: stats.banners,
    },
    {
      title: 'Analytics',
      description: 'Platform analytics and insights',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-teal-500',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#465362]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#465362] mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all platform entities and operations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {adminModules.map((module) => (
              <Link key={module.href} href={module.href}>
                <Card hover className="h-full transition-all hover:shadow-lg cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className={`${module.color} p-3 rounded-lg text-white`}>
                      <module.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#465362] mb-1">
                        {module.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      {module.count !== undefined && (
                        <p className="text-2xl font-bold text-[#465362]">{module.count}</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-[#C2EABD] to-[#D9F8D4] border-0">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-[#465362]" size={24} />
              <div>
                <h3 className="font-semibold text-[#465362] mb-1">Admin Access</h3>
                <p className="text-sm text-gray-700">
                  You have full administrative access to manage all platform entities. Use the modules above to navigate to different management sections.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

