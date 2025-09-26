

import React from 'react';
import Header from './Header';
import { useLanguage } from '../contexts/LanguageContext';
import CheckIcon from './icons/CheckIcon';
// FIX: Import Profile type.
import type { User, Profile } from '../types';

interface PublishAdPageProps {
  onBack: () => void;
  onPublishAdClick: () => void;
  onOpenLoginModal: () => void;
  onNavigateToJourney: () => void;
  user: User | null;
  // FIX: Added profile prop to be passed to Header.
  profile: Profile | null;
  onLogout: () => void;
  onNavigateToFavorites: () => void;
  onNavigateToChatList: () => void;
  // FIX: Add onNavigateToMyAds prop to resolve typing error.
  onNavigateToMyAds: () => void;
  onNavigateToAllListings: () => void;
  hasUnreadMessages: boolean;
  navigateToGuideToSell: () => void;
  navigateToDocumentsForSale: () => void;
  navigateHome: () => void;
  // FIX: Added onAccessClick to satisfy HeaderProps requirement.
  onAccessClick: () => void;
}

const PublishAdPage: React.FC<PublishAdPageProps> = (props) => {
  const { t } = useLanguage();
  const { user, onNavigateToJourney, onOpenLoginModal } = props;

  const handlePublishClick = () => {
    if (user) {
      onNavigateToJourney();
    } else {
      onOpenLoginModal();
    }
  };

  return (
    <div className="bg-brand-light-gray min-h-screen">
       <Header {...props} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="text-sm mb-6">
          <span onClick={props.onBack} className="text-brand-red hover:underline cursor-pointer">
            {t('publishAdPage.breadcrumbHome')}
          </span>
          <span className="text-brand-gray mx-2">&gt;</span>
          <span className="text-brand-dark font-medium">{t('publishAdPage.breadcrumbPublish')}</span>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-lg mb-12 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-navy mb-6">{t('publishAdPage.mainCard.title')}</h1>
            <ul className="space-y-4 mb-6 text-brand-dark">
              <li className="flex items-start">
                <CheckIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>{t('publishAdPage.mainCard.benefit1')}</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>{t('publishAdPage.mainCard.benefit2')}</span>
              </li>
              <li className="flex items-start">
                <CheckIcon className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <span>{t('publishAdPage.mainCard.benefit3')}</span>
              </li>
            </ul>
            <p className="text-sm text-brand-gray mb-6">{t('publishAdPage.mainCard.agencyInfo')}</p>
            <button 
              onClick={handlePublishClick}
              className="bg-brand-red text-white font-bold py-3 px-8 rounded-md hover:opacity-90 transition-opacity duration-200 mb-4"
            >
              {t('publishAdPage.mainCard.publishButton')}
            </button>
            <p className="text-sm text-brand-gray">{t('publishAdPage.mainCard.professionalInfo')}</p>
          </div>
          <div className="md:w-2/5 mt-8 md:mt-0 flex justify-center">
            <img src="https://i.imgur.com/FuxDdyF.png" alt="Logotipo da Quallity Home" className="max-w-xs w-full" />
          </div>
        </div>

        {/* Steps Section */}
        <div className="bg-white p-6 sm:p-8 md:p-12 rounded-lg shadow-lg mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy mb-4">{t('publishAdPage.steps.title')}</h2>
            <p className="text-brand-gray mb-8">{t('publishAdPage.steps.intro')}</p>
            <div className="space-y-6 text-brand-dark leading-relaxed">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.steps.step1Title')}</h3>
                    <p className="whitespace-pre-line text-sm sm:text-base">{t('publishAdPage.steps.step1Content')}</p>
                </div>
                 <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.steps.step2Title')}</h3>
                    <p className="text-sm sm:text-base">{t('publishAdPage.steps.step2Content')}</p>
                </div>
                 <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.steps.step3Title')}</h3>
                    <p className="text-sm sm:text-base">{t('publishAdPage.steps.step3Content')}</p>
                </div>
                 <div>
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.steps.step4Title')}</h3>
                    <p className="text-sm sm:text-base">{t('publishAdPage.steps.step4Content')}</p>
                </div>
            </div>
        </div>
        
        {/* Advantages Section */}
        <div className="p-6 sm:p-8 md:p-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy mb-8 text-center">{t('publishAdPage.advantages.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-brand-dark">
                {/* Advantage Card 1 */}
                <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.advantages.advantage1Title')}</h3>
                    <p className="text-sm sm:text-base">{t('publishAdPage.advantages.advantage1Content')}</p>
                </div>
                {/* Advantage Card 2 */}
                <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.advantages.advantage2Title')}</h3>
                    <p className="text-sm sm:text-base">{t('publishAdPage.advantages.advantage2Content')}</p>
                </div>
                {/* Advantage Card 3 */}
                <div className="bg-white p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-default">
                    <h3 className="text-lg sm:text-xl font-bold text-brand-navy mb-2">{t('publishAdPage.advantages.advantage3Title')}</h3>
                    <p className="text-sm sm:text-base">{t('publishAdPage.advantages.advantage3Content')}</p>
                </div>
            </div>
        </div>

      </div>
       <footer className="bg-brand-light-gray text-brand-gray py-8 text-center mt-12">
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

export default PublishAdPage;