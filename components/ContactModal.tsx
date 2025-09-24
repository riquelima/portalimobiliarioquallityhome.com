

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import CloseIcon from './icons/CloseIcon';
import WhatsappIcon from './icons/WhatsappIcon';
import ChatIcon from './icons/ChatIcon';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Changed owner.name to owner.nome_completo and made phone optional to align with Profile type.
  owner?: { nome_completo: string; phone?: string };
  propertyTitle: string;
  onStartChat: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, owner, propertyTitle, onStartChat }) => {
  const { t } = useLanguage();

  if (!isOpen || !owner) {
    return null;
  }

  const whatsappMessage = t('contactModal.whatsappMessage', { title: propertyTitle });
  const whatsappLink = `https://wa.me/${owner.phone}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      aria-labelledby="contact-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true"></div>

      <div className="relative bg-white rounded-lg shadow-xl w-11/12 max-w-sm p-6 sm:p-8 m-4 transform transition-all">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label={t('header.closeMenu')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <h2 id="contact-modal-title" className="text-xl sm:text-2xl font-bold text-brand-navy mb-6">
          {t('contactModal.title')}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-gray">{t('contactModal.contactPerson')}</label>
            {/* FIX: Use nome_completo instead of name. */}
            <p className="text-lg text-brand-dark font-semibold">{owner.nome_completo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-gray">{t('contactModal.phone')}</label>
            <p className="text-lg text-brand-dark font-semibold">{owner.phone}</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 transition-colors duration-300"
          >
            <WhatsappIcon className="w-6 h-6 mr-3" />
            <span>{t('contactModal.whatsappButton')}</span>
          </a>
          <button
            onClick={onStartChat}
            className="w-full flex items-center justify-center bg-gray-200 text-brand-dark font-bold py-3 px-4 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            <ChatIcon className="w-6 h-6 mr-3" />
            <span>{t('contactModal.chatButton')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
