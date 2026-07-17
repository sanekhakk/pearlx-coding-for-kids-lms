export const WHATSAPP_NUMBER = "916239434959";

/**
 * Build a wa.me link that opens WhatsApp with `message` already typed in.
 * @param {string} message - the text to pre-fill, written in plain language
 */
export const getWhatsAppLink = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;