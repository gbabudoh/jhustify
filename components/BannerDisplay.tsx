'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Banner {
  _id: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string;
  position: 'MAIN_LEFT' | 'TOP_RIGHT' | 'MIDDLE_RIGHT' | 'BOTTOM_RIGHT';
}

export default function BannerDisplay() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const impressionTracked = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/banners');
      const data = await response.json();
      setBanners(data.banners || []);

      // Track impressions for all banners
      if (data.banners && data.banners.length > 0) {
        data.banners.forEach((banner: Banner) => {
          trackImpression(banner._id);
        });
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackImpression = async (bannerId: string) => {
    // Only track once per page load
    if (impressionTracked.current.has(bannerId)) return;

    impressionTracked.current.add(bannerId);

    try {
      await fetch(`/api/banners/${bannerId}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'impression' }),
      });
    } catch (error) {
      console.error('Error tracking impression:', error);
    }
  };

  const trackClick = async (bannerId: string) => {
    try {
      await fetch(`/api/banners/${bannerId}/analytics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'click' }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const getBannersByPosition = (position: string) => {
    return banners.filter((banner) => banner.position === position);
  };

  const mainLeftBanner = getBannersByPosition('MAIN_LEFT')[0];
  const topRightBanner = getBannersByPosition('TOP_RIGHT')[0];
  const middleRightBanner = getBannersByPosition('MIDDLE_RIGHT')[0];
  const bottomRightBanner = getBannersByPosition('BOTTOM_RIGHT')[0];

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 h-64 md:h-80 lg:h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            <div className="lg:col-span-1 flex flex-col gap-4">
              <div className="h-24 lg:h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-24 lg:h-24 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="h-24 lg:h-24 bg-gray-200 rounded-xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    // Sample banner data for slider when no banners exist
    const sampleBanners = [
      {
        title: "Welcome to Jhustify",
        description: "Your trusted gateway to Africa's real economy",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        linkUrl: "https://example.com/advertiser1"
      },
      {
        title: "Get Verified Today",
        description: "Build trust and grow your business with verified credentials",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
        linkUrl: "https://example.com/advertiser2"
      },
      {
        title: "Search Businesses",
        description: "Connect with verified businesses across Africa",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        linkUrl: "https://example.com/advertiser3"
      }
    ];

    return (
      <>
        <style jsx>{`
          :global(.swiper-pagination-bullet) {
            background-color: white !important;
            opacity: 0.7 !important;
            width: 12px !important;
            height: 12px !important;
          }
          :global(.swiper-pagination-bullet-active) {
            background-color: white !important;
            opacity: 1 !important;
            width: 32px !important;
            border-radius: 4px !important;
          }
        `}</style>
        <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Left Banner with Slider */}
            <div className="lg:col-span-2">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                  reverseDirection: false,
                  stopOnLastSlide: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  bulletClass: 'swiper-pagination-bullet',
                  bulletActiveClass: 'swiper-pagination-bullet-active',
                }}
                navigation={{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }}
                keyboard={{
                  enabled: true,
                  onlyInViewport: true,
                }}
                mousewheel={{
                  forceToAxis: true,
                  sensitivity: 1,
                  eventsTarget: 'container',
                  invert: false,
                }}
                allowTouchMove={true}
                resistance={true}
                resistanceRatio={0.85}
                grabCursor={true}
                simulateTouch={true}
                touchRatio={1}
                touchAngle={45}
                longSwipes={true}
                longSwipesRatio={0.5}
                shortSwipes={true}
                followFinger={true}
                allowSlidePrev={true}
                allowSlideNext={true}
                swipeHandler={null}
                noSwiping={false}
                noSwipingClass='swiper-no-swiping'
                passiveListeners={true}
                preventClicks={true}
                preventClicksPropagation={true}
                slideToClickedSlide={false}
                watchSlidesProgress={true}
                direction='horizontal'
                className="rounded-xl overflow-hidden shadow-lg"
                style={{ height: '384px' }}
              >
                {sampleBanners.map((banner, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full">
                      <a
                        href={banner.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-full"
                      >
                        <img
                          src={banner.imageUrl}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    </div>
                  </SwiperSlide>
                ))}
                <div className="swiper-button-prev !bg-transparent !backdrop-blur-none !w-12 !h-12 !left-4 !hover:!bg-transparent transition-all duration-200 after:!text-2xl after:!text-white"></div>
                <div className="swiper-button-next !bg-transparent !backdrop-blur-none !w-12 !h-12 !right-4 !hover:!bg-transparent transition-all duration-200 after:!text-2xl after:!text-white"></div>
              </Swiper>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-4" style={{ height: '384px' }}>
              <div className="relative overflow-hidden rounded-xl flex-1">
                <a
                  href="https://example.com/advertiser4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Business Growth"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="bg-black/50 rounded px-2 py-1 inline-block">
                      <p className="text-sm font-semibold">Business Growth</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="relative overflow-hidden rounded-xl flex-1">
                <a
                  href="https://example.com/advertiser5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Trust & Security"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="bg-black/50 rounded px-2 py-1 inline-block">
                      <p className="text-sm font-semibold">Trust & Security</p>
                    </div>
                  </div>
                </a>
              </div>
              <div className="relative overflow-hidden rounded-xl flex-1">
                <a
                  href="https://example.com/advertiser6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full"
                >
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                    alt="Network Solutions"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="bg-black/50 rounded px-2 py-1 inline-block">
                      <p className="text-sm font-semibold">Network Solutions</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      </>
    );
  }

  return (
    <section className="container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Left Banner - Takes 2 columns on large screens */}
          {mainLeftBanner && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              <a
                href={mainLeftBanner.linkUrl || '#'}
                target={mainLeftBanner.linkUrl ? '_blank' : '_self'}
                rel={mainLeftBanner.linkUrl ? 'noopener noreferrer' : ''}
                onClick={() => trackClick(mainLeftBanner._id)}
                className="block group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
                  <img
                    src={mainLeftBanner.imageUrl}
                    alt={mainLeftBanner.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{mainLeftBanner.title}</h3>
                      {mainLeftBanner.description && (
                        <p className="text-sm opacity-90">{mainLeftBanner.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              </a>
            </motion.div>
          )}

          {/* Right Side Banners - Stack vertically */}
          <div className="lg:col-span-1 flex flex-col gap-4" style={{ height: '384px' }}>
            {/* Top Right Banner */}
            {topRightBanner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex-1"
              >
                <a
                  href={topRightBanner.linkUrl || '#'}
                  target={topRightBanner.linkUrl ? '_blank' : '_self'}
                  rel={topRightBanner.linkUrl ? 'noopener noreferrer' : ''}
                  onClick={() => trackClick(topRightBanner._id)}
                  className="block group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative w-full h-full min-h-[120px] md:min-h-[140px] lg:min-h-[100px] overflow-hidden">
                    <img
                      src={topRightBanner.imageUrl}
                      alt={topRightBanner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </a>
              </motion.div>
            )}

            {/* Middle Right Banner */}
            {middleRightBanner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1"
              >
                <a
                  href={middleRightBanner.linkUrl || '#'}
                  target={middleRightBanner.linkUrl ? '_blank' : '_self'}
                  rel={middleRightBanner.linkUrl ? 'noopener noreferrer' : ''}
                  onClick={() => trackClick(middleRightBanner._id)}
                  className="block group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative w-full h-full min-h-[120px] md:min-h-[140px] lg:min-h-[100px] overflow-hidden">
                    <img
                      src={middleRightBanner.imageUrl}
                      alt={middleRightBanner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </a>
              </motion.div>
            )}

            {/* Bottom Right Banner */}
            {bottomRightBanner && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex-1"
              >
                <a
                  href={bottomRightBanner.linkUrl || '#'}
                  target={bottomRightBanner.linkUrl ? '_blank' : '_self'}
                  rel={bottomRightBanner.linkUrl ? 'noopener noreferrer' : ''}
                  onClick={() => trackClick(bottomRightBanner._id)}
                  className="block group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full"
                >
                  <div className="relative w-full h-full min-h-[120px] md:min-h-[140px] lg:min-h-[100px] overflow-hidden">
                    <img
                      src={bottomRightBanner.imageUrl}
                      alt={bottomRightBanner.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </a>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
