

import React from 'react';
import Header from './Header';
import PropertyCard from './PropertyCard';
// FIX: Import Profile type.
import type { Property, User, Profile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import SearchIcon from './icons/SearchIcon';

interface SearchResultsPageProps {
  onBack: () => void;
  searchQuery: string;
  properties: Property[];
  onPublishAdClick: () => void;
  onAccessClick: () => void;
  user: User | null;
  // FIX: Added profile prop to be passed to Header.
  profile: Profile | null;
  onLogout: () => void;
  onViewDetails: (id: number) => void;
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onNavigateToFavorites: () => void;
  onNavigateToChatList: () => void;
  // FIX: Add onNavigateToMyAds prop to resolve typing error.
  onNavigateToMyAds: () => void;
  onNavigateToAllListings: () => void;
  hasUnreadMessages: boolean;
  onContactClick: (property: Property) => void;
  // FIX: Added missing props for Header.
  navigateToGuideToSell: () => void;
  navigateToDocumentsForSale: () => void;
  navigateHome: () => void;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ 
  onBack, 
  searchQuery, 
  properties, 
  onPublishAdClick, 
  onAccessClick, 
  user,
  profile,
  onLogout,
  onViewDetails,
  favorites,
  onToggleFavorite,
  onNavigateToFavorites,
  onNavigateToChatList,
  onNavigateToMyAds,
  onNavigateToAllListings,
  hasUnreadMessages,
  onContactClick,
  navigateToGuideToSell,
  navigateToDocumentsForSale,
  navigateHome
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-brand-light-gray min-h-screen flex flex-col">
      {/* FIX: Pass profile prop to Header. */}
      {/* FIX: Pass onNavigateToMyAds prop to Header. */}
      {/* FIX: Pass navigateHome prop to Header. */}
      <Header 
        onPublishAdClick={onPublishAdClick} 
        onAccessClick={onAccessClick} 
        user={user} 
        profile={profile}
        onLogout={onLogout} 
        onNavigateToFavorites={onNavigateToFavorites}
        onNavigateToChatList={onNavigateToChatList}
        onNavigateToMyAds={onNavigateToMyAds}
        onNavigateToAllListings={onNavigateToAllListings}
        hasUnreadMessages={hasUnreadMessages}
        navigateToGuideToSell={navigateToGuideToSell}
        navigateToDocumentsForSale={navigateToDocumentsForSale}
        navigateHome={navigateHome}
      />
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumbs */}
          <div className="text-sm mb-6">
            <span onClick={onBack} className="text-brand-red hover:underline cursor-pointer">
              {t('map.breadcrumbs.home')}
            </span>
            <span className="text-brand-gray mx-2">&gt;</span>
            <span className="text-brand-dark font-medium">{t('searchResults.breadcrumb')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-2">
            {t('searchResults.title', { query: searchQuery })}
          </h1>
          <p className="text-brand-gray mb-8">
            {t('searchResults.subtitle', { count: properties.length })}
          </p>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {properties.map((property) => (
                <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onViewDetails={onViewDetails}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={onToggleFavorite}
                    onContactClick={onContactClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-white rounded-lg shadow-md">
              <SearchIcon className="w-12 h-12 sm:w-16 sm:h-16 text-brand-gray mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-2">{t('searchResults.noResults.title')}</h2>
              <p className="text-brand-gray max-w-md mx-auto">{t('searchResults.noResults.description')}</p>
            </div>
          )}
        </div>
      </main>
      <footer className="bg-brand-light-gray text-brand-gray py-8 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} {t('footer.text')}</p>
            <div className="mt-4">
              <a href="https://www.instagram.com/portalimobiliarioquallityhome/" target="_blank" rel="noopener noreferrer" aria-label="Siga-nos no Instagram" className="inline-block hover:opacity-75 transition-opacity">
                <img src="https://cdn-icons-png.flaticon.com/512/3621/3621435.png" alt="Instagram" className="h-8 w-8" />
              </a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default SearchResultsPage;