

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle, DrawingManager } from '@react-google-maps/api';
import type { Property } from '../types';
import PropertyCard from './PropertyCard';
import { useLanguage } from '../contexts/LanguageContext';
import DrawIcon from './icons/DrawIcon';
import CloseIcon from './icons/CloseIcon';
import SpinnerIcon from './icons/SpinnerIcon';


interface MapDrawPageProps {
  onBack: () => void;
  userLocation?: { lat: number; lng: number } | null;
  onViewDetails: (id: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  properties: Property[];
  onContactClick: (property: Property) => void;
}

interface PropertyWithDistance extends Property {
  distance: number;
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyDukeY7JJI9UkHIFbsCZOrjPDRukqvUOfA';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const libraries: ('drawing' | 'places' | 'visualization')[] = ['drawing', 'visualization'];

const MapDrawPage: React.FC<MapDrawPageProps> = ({ onBack, userLocation, onViewDetails, favorites, onToggleFavorite, properties, onContactClick }) => {
  const { t } = useLanguage();
  // FIX: Replace google.maps.Map with any to resolve missing namespace error.
  const [map, setMap] = useState<any | null>(null);
  const [propertiesInZone, setPropertiesInZone] = useState<PropertyWithDistance[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  // FIX: Replace google.maps.LatLngLiteral with any to resolve missing namespace error.
  const [drawnCircle, setDrawnCircle] = useState<{center: any, radius: number} | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script-draw-page',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  // FIX: Replace google.maps.Map with any to resolve missing namespace error.
  const onLoad = useCallback(function callback(mapInstance: any) {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property);
  }, []);

  const onInfoWindowClose = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Effect for userLocation search
  useEffect(() => {
    // FIX: Access google.maps through window object to resolve missing namespace error.
    if (isLoaded && userLocation && (window as any).google?.maps?.geometry) {
      const searchRadius = 5000; // 5km
      // FIX: Access google.maps through window object to resolve missing namespace error.
      const userLatLng = new (window as any).google.maps.LatLng(userLocation.lat, userLocation.lng);
      
      const foundProperties: PropertyWithDistance[] = properties
        .map(prop => {
          // FIX: Access google.maps through window object to resolve missing namespace error.
          const propLatLng = new (window as any).google.maps.LatLng(prop.lat, prop.lng);
          // FIX: Access google.maps through window object to resolve missing namespace error.
          const distance = (window as any).google.maps.geometry.spherical.computeDistanceBetween(userLatLng, propLatLng);
          return { ...prop, distance };
        })
        .filter(prop => prop.distance <= searchRadius)
        .sort((a, b) => a.distance - b.distance);
      
      setPropertiesInZone(foundProperties);
      setIsSidebarOpen(foundProperties.length > 0);
    }
  }, [isLoaded, userLocation, properties]);
  
  // FIX: Replace google.maps.Circle with any to resolve missing namespace error.
  const onCircleComplete = (circle: any) => {
    const radius = circle.getRadius();
    const center = circle.getCenter();
    setIsDrawing(false);

    // FIX: Access google.maps through window object to resolve missing namespace error.
    if (center && radius && (window as any).google?.maps?.geometry) {
      setDrawnCircle({ center: center.toJSON(), radius });
      const foundProperties: PropertyWithDistance[] = properties.map(prop => {
        // FIX: Access google.maps through window object to resolve missing namespace error.
        const propLatLng = new (window as any).google.maps.LatLng(prop.lat, prop.lng);
        // FIX: Access google.maps through window object to resolve missing namespace error.
        const distance = (window as any).google.maps.geometry.spherical.computeDistanceBetween(center, propLatLng);
        return { ...prop, distance };
      }).filter(prop => prop.distance <= radius)
        .sort((a, b) => a.distance - b.distance);
        
      setPropertiesInZone(foundProperties);
      setIsSidebarOpen(foundProperties.length > 0);
    }
    // Disable drawing mode after one circle is drawn
    if (map) {
      circle.setMap(null); // The DrawingManager adds the circle, we want to control it via state
    }
  };
  
  const handleStartDrawing = () => {
    handleClearDrawing();
    setIsDrawing(true);
  }

  const handleClearDrawing = useCallback(() => {
    setDrawnCircle(null);
    setPropertiesInZone([]);
    setIsSidebarOpen(false);
    setIsDrawing(false);
  }, []);

  const renderMap = () => {
    if (loadError) return <div className="w-full h-full flex items-center justify-center bg-gray-100"><p>Error loading maps</p></div>;
    if (!isLoaded) return <div className="w-full h-full flex items-center justify-center bg-gray-100"><SpinnerIcon className="w-12 h-12 animate-spin text-brand-gray" /></div>;

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || { lat: -12.9777, lng: -38.5016 }}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          zoomControl: true,
        }}
      >
        {/* Markers */}
        {properties.map(prop => (
          <Marker 
            key={prop.id} 
            position={{ lat: prop.lat, lng: prop.lng }}
            onClick={() => onMarkerClick(prop)}
          />
        ))}

        {/* User Location Marker */}
        {/* FIX: Access google.maps through window object to resolve missing namespace error. */}
        {userLocation && <Marker position={userLocation} icon={{ path: (window as any).google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: '#4285F4', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2 }} />}

        {/* InfoWindow */}
        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={onInfoWindowClose}
          >
             <div className="w-48">
                 <h3 className="font-bold text-sm mb-1 truncate">{selectedProperty.title}</h3>
                 <button 
                     onClick={() => onViewDetails(selectedProperty.id)}
                     className="w-full bg-brand-red text-white text-xs font-bold py-1 px-2 rounded hover:opacity-90"
                 >
                     {t('propertyCard.details')}
                 </button>
             </div>
          </InfoWindow>
        )}
        
        {/* Drawing Manager */}
        {!userLocation && isDrawing && (
          <DrawingManager
            onCircleComplete={onCircleComplete}
            options={{
              drawingControl: false,
              // FIX: Access google.maps through window object to resolve missing namespace error.
              drawingMode: (window as any).google.maps.drawing.OverlayType.CIRCLE,
              circleOptions: {
                fillColor: '#D81B2B',
                fillOpacity: 0.2,
                strokeColor: '#D81B2B',
                strokeWeight: 2,
                clickable: false,
                editable: false,
                zIndex: 1,
              },
            }}
          />
        )}
        
        {/* Drawn Circle from state */}
        {drawnCircle && (
          <Circle
            center={drawnCircle.center}
            radius={drawnCircle.radius}
            options={{
              fillColor: '#D81B2B',
              fillOpacity: 0.2,
              strokeColor: '#D81B2B',
              strokeWeight: 2,
            }}
          />
        )}
      </GoogleMap>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-[100]">
      {renderMap()}

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 md:p-6 z-[1000] bg-gradient-to-b from-white/80 to-transparent pointer-events-none">
         <div className="container mx-auto pointer-events-auto">
            <div className="text-sm mb-4">
                <span onClick={onBack} className="text-brand-red hover:underline cursor-pointer">{t('map.breadcrumbs.home')}</span>
                <span className="text-brand-gray mx-2">&gt;</span>
                <span className="text-brand-dark font-medium">{userLocation ? t('map.breadcrumbs.proximitySearch') : t('map.breadcrumbs.drawOnMap')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-navy">
              {userLocation ? t('map.title.proximity') : t('map.title.draw')}
            </h1>
        </div>
      </div>

      {!userLocation && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
            {!isDrawing && !drawnCircle && (
                <button
                    onClick={handleStartDrawing}
                    className="bg-brand-red hover:opacity-90 text-white font-bold py-3 px-6 rounded-full shadow-2xl transition duration-300 flex items-center space-x-2"
                >
                    <DrawIcon className="w-5 h-5" />
                    <span>{t('map.drawButton')}</span>
                </button>
            )}
            {isDrawing && (
                <div className="bg-white text-brand-dark font-bold py-3 px-6 rounded-full shadow-2xl animate-pulse">
                    <span>{t('map.drawingInProgress')}</span>
                </div>
            )}
            {drawnCircle && (
                <button
                    onClick={handleClearDrawing}
                    className="bg-brand-dark hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl transition duration-300 flex items-center space-x-2"
                >
                    <CloseIcon className="w-5 h-5"/>
                    <span>{t('map.clearButton')}</span>
                </button>
            )}
        </div>
      )}
      
      {userLocation && propertiesInZone.length > 0 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            className="bg-brand-navy hover:bg-brand-dark text-white font-bold py-3 px-6 rounded-full shadow-2xl transition duration-300"
          >
            {isSidebarOpen ? t('map.toggleResults.hide') : t('map.toggleResults.show', { count: propertiesInZone.length })}
          </button>
        </div>
      )}

      {isSidebarOpen && (
          <div 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-black/30 z-[1050] transition-opacity duration-300"
          />
      )}

      <aside className={`
        fixed md:absolute bottom-0 left-0 right-0 md:top-0 md:left-auto
        h-2/3 md:h-full w-full md:max-w-md 
        bg-white shadow-2xl z-[1100] rounded-t-2xl md:rounded-t-none
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen 
          ? 'translate-y-0 md:translate-x-0' 
          : 'translate-y-full md:translate-y-0 md:translate-x-full'
        }`}>
        <div className="h-full flex flex-col">
            <div className="p-4 border-b flex-shrink-0">
                <div className="md:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-2 cursor-grab" />
                <div className="flex justify-between items-center">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy">
                        {userLocation 
                            ? t('map.resultsPanel.proximityTitle', { count: propertiesInZone.length, radius: 5 })
                            : t('map.resultsPanel.title', { count: propertiesInZone.length })
                        }
                    </h3>
                    <button onClick={() => setIsSidebarOpen(false)} className="text-2xl text-brand-gray hover:text-brand-dark">&times;</button>
                </div>
            </div>
            <div className="overflow-y-auto p-4 flex-grow">
                <div className="space-y-4">
                {propertiesInZone.length > 0 ? (
                    propertiesInZone.map(prop => (
                        <PropertyCard 
                            key={prop.id} 
                            property={prop} 
                            onViewDetails={onViewDetails}
                            isFavorite={favorites.includes(prop.id)}
                            onToggleFavorite={onToggleFavorite}
                            onContactClick={onContactClick}
                        />
                    ))
                ) : (
                    <div className="text-center text-brand-gray mt-8">
                        <p>{t('map.resultsPanel.noResults.line1')}</p>
                        <p>{t('map.resultsPanel.noResults.line2')}</p>
                    </div>
                )}
                </div>
            </div>
        </div>
      </aside>
    </div>
  );
};

export default MapDrawPage;