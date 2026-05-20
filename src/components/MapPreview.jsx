import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';

// Custom icons using HTML
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

const pickupIcon = createCustomIcon('#3b82f6'); // Blue
const dropoffIcon = createCustomIcon('#000000'); // Black

// Helper to update map center/bounds dynamically
const MapController = ({ center, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (center && !map.isDragging) {
      map.setView(center, map.getZoom() || 14);
    }
  }, [center, bounds, map]);
  return null;
};

const MapEvents = ({ isInteractive, onCenterChanged }) => {
  const map = useMapEvents({
    dragend: () => {
      if (isInteractive && onCenterChanged) {
        const c = map.getCenter();
        onCenterChanged({ lat: c.lat, lng: c.lng });
      }
    },
    zoomend: () => {
      if (isInteractive && onCenterChanged) {
        const c = map.getCenter();
        onCenterChanged({ lat: c.lat, lng: c.lng });
      }
    }
  });
  return null;
};

const defaultCenter = [28.6139, 77.2090]; // New Delhi

const MapPreview = ({ isInteractive = false, showRoute = false, routeCoordinates = null, pickupLocation = null, dropoffLocation = null, onCenterChanged = null, fullHeight = false }) => {
  const [center, setCenter] = useState(defaultCenter);
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    // 1. Try to get user location if no specific location is provided
    if (!routeCoordinates && !pickupLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCenter([position.coords.latitude, position.coords.longitude]);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    }

    // 2. Set bounds or center based on props
    if (routeCoordinates && routeCoordinates.length > 0) {
      const lats = routeCoordinates.map(c => c[0]);
      const lngs = routeCoordinates.map(c => c[1]);
      setBounds([
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)]
      ]);
    } else if (pickupLocation) {
      setCenter([pickupLocation.lat, pickupLocation.lng]);
    }
  }, [routeCoordinates, pickupLocation]);

  return (
    <div className={`relative w-full ${fullHeight ? 'h-full' : 'h-[45vh]'} z-0`}>
      <MapContainer
        center={center}
        zoom={14}
        scrollWheelZoom={isInteractive}
        dragging={isInteractive}
        zoomControl={false}
        className="w-full h-full"
      >
        <MapController center={center} bounds={bounds} />
        <MapEvents isInteractive={isInteractive} onCenterChanged={onCenterChanged} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Clean, modern tiles
        />

        {showRoute && routeCoordinates && (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
          />
        )}

        {!showRoute && pickupLocation && (
          <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon} />
        )}

        {showRoute && routeCoordinates && routeCoordinates.length > 0 && (
          <>
            <Marker position={routeCoordinates[0]} icon={pickupIcon} />
            <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={dropoffIcon} />
          </>
        )}
      </MapContainer>

      {/* Crosshair for interactive mode */}
      {isInteractive && !showRoute && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[400]">
          <MapPin className="w-10 h-10 text-red-500 drop-shadow-xl -mt-5" />
          <div className="w-3 h-1 bg-black/20 rounded-full mx-auto mt-1 blur-[1px]"></div>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-[400]"></div>
    </div>
  );
};

export default MapPreview;
