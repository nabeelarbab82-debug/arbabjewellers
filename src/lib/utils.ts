export const UPLOADS_URL = process.env.NEXT_PUBLIC_UPLOADS_URL || 'http://localhost:5000/uploads';

export const getImageUrl = (imagePath: string | undefined) => {
  if (!imagePath) return '/placeholder-product.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  return `${UPLOADS_URL}/${imagePath}`;
};

export const formatPrice = (price: number, locale: string = 'en') => {
  if (locale === 'ur' || locale === 'ar') {
    return `${price.toLocaleString()} روپے`;
  }
  return `PKR ${price.toLocaleString()}`;
};

export const truncateText = (text: string, length: number = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const formatDate = (date: string | Date, locale: string = 'en') => {
  const d = new Date(date);
  return d.toLocaleDateString(locale === 'ur' ? 'ur-PK' : locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
