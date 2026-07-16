// src/utils/whatsapp.js
//
// Single source of truth for PearlX's WhatsApp contact.
// Every "Enquire / Enrol / Chat on WhatsApp" button across the landing page
// should build its href with getWhatsAppLink() so the link AND the
// pre-filled message always match the button that was clicked.

// TODO: replace with PearlX's real WhatsApp Business number.
// Format: country code + number, digits only, no "+", no spaces, no dashes.
// e.g. "919812345678"
export const WHATSAPP_NUMBER = "916239434959";

/**
 * Build a wa.me link that opens WhatsApp with `message` already typed in.
 * @param {string} message - the text to pre-fill, written in plain language
 */
export const getWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;