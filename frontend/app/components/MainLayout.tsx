'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  useEffect(() => {
    if (isAdmin || !pathname) return;

    const trackVisit = async () => {
      try {
        // Get or create unique anonymous visitor ID
        let userId = localStorage.getItem('portfolio_visitor_id');
        if (!userId) {
          userId = 'usr_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
          localStorage.setItem('portfolio_visitor_id', userId);
        }

        // Fetch geolocation info (graceful fallback if blocked)
        let geoData = {
          ip: '127.0.0.1',
          city: 'Local Area',
          country_name: 'Unknown',
          latitude: 0.0,
          longitude: 0.0
        };

        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            const data = await geoRes.json();
            if (data && data.ip) {
              geoData = {
                ip: data.ip || '127.0.0.1',
                city: data.city || 'Unknown',
                country_name: data.country_name || 'Unknown',
                latitude: data.latitude || 0.0,
                longitude: data.longitude || 0.0
              };
            }
          }
        } catch (err) {
          console.log("Geolocation fetch skipped or blocked, using fallback", err);
        }

        // Send to backend analytics tracker
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: userId,
            path: pathname,
            ip: geoData.ip,
            city: geoData.city,
            country: geoData.country_name,
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            userAgent: navigator.userAgent
          })
        });
      } catch (error) {
        console.error("Failed to track visitor session:", error);
      }
    };

    trackVisit();
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}

