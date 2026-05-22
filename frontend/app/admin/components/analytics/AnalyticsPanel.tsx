'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Activity, Users, MapPin, Eye, Clock, 
  Trash2, Globe, Laptop, RefreshCw, Compass
} from 'lucide-react';
import './AnalyticsPanel.css';

interface VisitRecord {
  id: string;
  userId: string;
  path: string;
  ip: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  userAgent: string;
  createdAt: string;
}

interface GroupedVisit {
  id: string;
  userId: string;
  ip: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  userAgent: string;
  createdAt: string;
  viewsCount: number;
  paths: { path: string; count: number; lastVisitedAt: string }[];
}

interface StatsSummary {
  totalVisits: number;
  uniqueUsers: number;
  topPaths: { path: string; count: number }[];
  topCountries: { country: string; count: number }[];
}

export default function AnalyticsPanel() {
  const [visits, setVisits] = useState<VisitRecord[]>([]);
  const [stats, setStats] = useState<StatsSummary>({
    totalVisits: 0,
    uniqueUsers: 0,
    topPaths: [],
    topCountries: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'stream' | 'map'>('stream');
  
  const mapInstanceRef = useRef<any>(null);
  const mapContainerId = 'analytics-leaflet-map';

  const groupedVisits = useMemo<GroupedVisit[]>(() => {
    const ipGroups: { [ip: string]: GroupedVisit } = {};
    
    visits.forEach(v => {
      if (!ipGroups[v.ip]) {
        ipGroups[v.ip] = {
          id: v.id,
          userId: v.userId,
          ip: v.ip,
          city: v.city,
          country: v.country,
          latitude: v.latitude,
          longitude: v.longitude,
          userAgent: v.userAgent,
          createdAt: v.createdAt,
          viewsCount: 0,
          paths: []
        };
      }
      
      const group = ipGroups[v.ip];
      group.viewsCount += 1;
      
      const pathEntry = group.paths.find(p => p.path === v.path);
      if (pathEntry) {
        pathEntry.count += 1;
      } else {
        group.paths.push({ path: v.path, count: 1, lastVisitedAt: v.createdAt });
      }
    });
    
    return Object.values(ipGroups);
  }, [visits]);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    setError('');
    try {
      // 1. Fetch visits logs
      const logsRes = await fetch('http://localhost:8080/api/analytics/');
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setVisits(logsData);
      }

      // 2. Fetch stats
      const statsRes = await fetch('http://localhost:8080/api/analytics/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Failed to load analytics data:", err);
      setError("Unable to connect to the backend analytics server. Make sure FastAPI is running!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (loading || groupedVisits.length === 0 || activeView !== 'map') return;

    // Load Leaflet resources dynamically
    const initMap = () => {
      // Prevent double-initialization
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const L = (window as any).L;
      if (!L) return;

      // Filter grouped visits with valid coordinates
      const validMarkers = groupedVisits.filter(v => v.latitude !== undefined && v.longitude !== undefined && v.latitude !== 0 && v.longitude !== 0);

      // Default center is first visit coordinates or fallback to (0,0)
      const centerLat = validMarkers.length > 0 ? validMarkers[0].latitude! : 20.0;
      const centerLng = validMarkers.length > 0 ? validMarkers[0].longitude! : 77.0;

      // Create map instance
      const map = L.map(mapContainerId).setView([centerLat, centerLng], validMarkers.length > 0 ? 3 : 2);
      mapInstanceRef.current = map;

      // CartoDB Dark Matter tile layer for an elegant, premium dark look
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Custom icon or custom circle markers with premium glowing styles
      validMarkers.forEach(v => {
        const pathsList = v.paths.map(p => `<span class="badge-path" style="margin: 2px; display: inline-block;">${p.path}${p.count > 1 ? ` (${p.count}x)` : ''}</span>`).join(' ');
        const customPopup = `
          <div class="map-popup-card">
            <h4>${v.city !== 'Unknown' ? v.city : 'Local Visitor'}, ${v.country}</h4>
            <p><strong>User ID:</strong> <span class="badge-id">${v.userId.substring(0, 12)}...</span></p>
            <p><strong>IP Addr:</strong> ${v.ip}</p>
            <p><strong>Views Count:</strong> <span class="badge-views">${v.viewsCount} visits</span></p>
            <p style="margin-top: 8px;"><strong>Paths Visited:</strong></p>
            <div class="popup-paths-container">${pathsList}</div>
            <p style="margin-top: 8px;"><strong>Last Active:</strong> ${new Date(v.createdAt).toLocaleTimeString()}</p>
          </div>
        `;

        // Glowing circle marker
        L.circleMarker([v.latitude!, v.longitude!], {
          radius: 8,
          fillColor: '#7c5cff',
          color: '#a78bfa',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.6
        })
        .bindPopup(customPopup)
        .addTo(map);
      });

      // Recalculate layout calculations once container is fully initialized in DOM
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 300);
    };

    // Check if Leaflet script is already loaded
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setTimeout(initMap, 200);
      };
      document.body.appendChild(script);
    } else {
      setTimeout(initMap, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [loading, groupedVisits, activeView]);

  const handleClearLogs = async () => {
    if (!window.confirm("Are you absolutely sure you want to clear all analytics visitor logs? This cannot be undone!")) return;
    
    try {
      const res = await fetch('http://localhost:8080/api/analytics/clear', {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuccessMsg("Visitor analytics cleared successfully!");
        setVisits([]);
        setStats({
          totalVisits: 0,
          uniqueUsers: 0,
          topPaths: [],
          topCountries: []
        });
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError("Failed to clear database logs.");
    }
  };

  const getBrowserDetails = (ua: string) => {
    if (ua.includes('Chrome')) return 'Google Chrome';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Apple Safari';
    if (ua.includes('Firefox')) return 'Mozilla Firefox';
    if (ua.includes('Edge')) return 'Microsoft Edge';
    return 'Other Browser';
  };

  const timeAgo = (dateStr: string) => {
    const elapsed = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(elapsed / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="analytics-admin-layout">
      {successMsg && <div className="admin-success-toast">{successMsg}</div>}
      {error && <div className="admin-error">{error}</div>}

      {/* Control Header Row */}
      <div className="analytics-control-row">
        <div>
          <p className="analytics-subtitle-desc">
            Geographic geolocation mapping and real-time page entry analytics logs.
          </p>
        </div>
        <div className="analytics-header-actions">
          <button 
            type="button" 
            onClick={() => fetchData(true)}
            className="refresh-action-btn"
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin-loader' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh Logs'}
          </button>
          <button 
            type="button" 
            onClick={handleClearLogs}
            className="clear-logs-btn"
          >
            <Trash2 size={14} />
            Clear Analytics
          </button>
        </div>
      </div>

      {loading ? (
        <div className="analytics-loading-box">
          <RefreshCw size={36} className="spin-loader" />
          <p>Analyzing MongoDB Logs...</p>
        </div>
      ) : (
        <>
          {/* Stats Dashboard Grid */}
          <div className="analytics-stats-grid">
            <div className="stats-card">
              <div className="stats-icon-box blue">
                <Eye size={20} />
              </div>
              <div className="stats-info">
                <h3>{stats.totalVisits}</h3>
                <p>Total Page Views</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-icon-box purple">
                <Users size={20} />
              </div>
              <div className="stats-info">
                <h3>{stats.uniqueUsers}</h3>
                <p>Unique Visitors</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-icon-box green">
                <MapPin size={20} />
              </div>
              <div className="stats-info">
                <h3>{visits.filter(v => v.city !== 'Unknown').length}</h3>
                <p>Geo-Mapped Visits</p>
              </div>
            </div>

            <div className="stats-card">
              <div className="stats-icon-box orange">
                <Compass size={20} />
              </div>
              <div className="stats-info">
                <h3>{stats.topCountries.length}</h3>
                <p>Countries Reached</p>
              </div>
            </div>
          </div>

          {/* View Selection Toggle Header */}
          <div className="analytics-view-toggle">
            <button 
              type="button"
              className={`toggle-btn ${activeView === 'stream' ? 'active' : ''}`}
              onClick={() => setActiveView('stream')}
            >
              <Activity size={15} />
              Activity Stream
            </button>
            <button 
              type="button"
              className={`toggle-btn ${activeView === 'map' ? 'active' : ''}`}
              onClick={() => setActiveView('map')}
            >
              <Globe size={15} />
              Geographic Visitor Map
            </button>
          </div>

          {activeView === 'map' ? (
            /* Interactive Leaflet Map Container Card */
            <div className="analytics-map-card">
              <div className="card-header">
                <Globe size={16} />
                <h4>Real-Time Geographic Visitor Map</h4>
              </div>
              <div className="map-wrapper-box">
                <div id={mapContainerId} style={{ width: '100%', height: '100%', minHeight: '420px', borderRadius: '12px' }}></div>
              </div>
            </div>
          ) : (
            <>
              {/* Details Tables Row */}
              <div className="analytics-details-row">
                {/* Top Visited Pages */}
                <div className="details-card-col">
                  <div className="card-header">
                    <Activity size={16} />
                    <h4>Top Visited Pages</h4>
                  </div>
                  <div className="card-content-box">
                    {stats.topPaths.length === 0 ? (
                      <div className="empty-state">No visits logged yet.</div>
                    ) : (
                      <div className="paths-list">
                        {stats.topPaths.map((p, idx) => {
                          const maxCount = Math.max(...stats.topPaths.map(item => item.count));
                          const percentage = maxCount > 0 ? (p.count / maxCount) * 100 : 0;
                          return (
                            <div key={idx} className="path-progress-item">
                              <div className="path-text-info">
                                <span className="path-url">{p.path}</span>
                                <span className="path-count">{p.count} views</span>
                              </div>
                              <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Geographical Distribution */}
                <div className="details-card-col">
                  <div className="card-header">
                    <Globe size={16} />
                    <h4>Top Visitor Geocodes</h4>
                  </div>
                  <div className="card-content-box">
                    {stats.topCountries.length === 0 ? (
                      <div className="empty-state">No geographical visitor data.</div>
                    ) : (
                      <div className="countries-list">
                        {stats.topCountries.map((c, idx) => (
                          <div key={idx} className="country-row-item">
                            <div className="country-geo-info">
                              <span className="geo-name">{c.country}</span>
                            </div>
                            <span className="geo-badge">{c.count} users</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Live Visitor Session Stream Log */}
              <div className="analytics-logs-card">
                <div className="card-header">
                  <Clock size={16} />
                  <h4>Live Activity Stream logs ({groupedVisits.length} visitors, {visits.length} views)</h4>
                </div>
                <div className="table-responsive-box">
                  {groupedVisits.length === 0 ? (
                    <div className="empty-state" style={{ padding: '40px' }}>No visitor records found. Try opening the homepage!</div>
                  ) : (
                    <table className="analytics-logs-table">
                      <thead>
                        <tr>
                          <th>Visitor ID</th>
                          <th>Location</th>
                          <th>IP Address</th>
                          <th>Paths Visited</th>
                          <th>Latest Activity</th>
                          <th>Browser / OS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedVisits.map((v) => (
                          <tr key={v.id}>
                            <td>
                              <span className="visitor-badge-code" title={v.userId}>
                                {v.userId.substring(0, 16)}...
                              </span>
                            </td>
                            <td>
                              <span className="visitor-geo-text">
                                {v.city !== 'Unknown' ? v.city : 'Local Area'}, {v.country}
                              </span>
                            </td>
                            <td>
                              <code className="visitor-ip">{v.ip}</code>
                            </td>
                            <td>
                              <div className="paths-column-cell">
                                <div className="main-path-row">
                                  <span className="path-badge-badge">{v.paths[0].path}</span>
                                  {v.viewsCount > 1 && (
                                    <span className="views-count-badge" title={`${v.viewsCount} total page views`}>
                                      {v.viewsCount} views
                                    </span>
                                  )}
                                </div>
                                {v.paths.length > 1 && (
                                  <div className="sub-paths-row">
                                    {v.paths.slice(1).map((p, idx) => (
                                      <span key={idx} className="path-badge-badge-subtle" title={`${p.path} (${p.count}x)`}>
                                        {p.path}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className="time-elapsed-badge">{timeAgo(v.createdAt)}</span>
                            </td>
                            <td>
                              <span className="user-agent-chip">
                                <Laptop size={12} />
                                {getBrowserDetails(v.userAgent)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
