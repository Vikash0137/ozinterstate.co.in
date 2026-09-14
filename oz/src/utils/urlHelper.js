/**
 * Helper utility to format media URLs correctly
 * Uses VITE_API_URL from environment, falls back to localhost for development
 */

import { resolveApiBaseUrl } from './siteSettings'

const API_BASE = resolveApiBaseUrl()

/**
 * Format an image or media URL to use the correct API endpoint
 * @param {string} imageUrl - The image URL from API response
 * @returns {string} - Properly formatted URL for the current environment
 */
export const formatImageUrl = (imageUrl) => {
  if (!imageUrl) return ''
  
  // If already a full URL, return as-is
  if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
    return imageUrl
  }
  
  // If relative path, prepend API_BASE
  return `${API_BASE}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
}

export default formatImageUrl
