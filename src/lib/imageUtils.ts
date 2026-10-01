/**
 * Helper to process, resize and normalize uploaded images to high-quality
 * JPEG data URLs so they are fast, light on localStorage, and 100% compatible
 * with jsPDF.
 */
export function processImageFile(file: File, maxSize = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      if (!src) {
        reject(new Error('ফাইল পড়তে ব্যর্থ হয়েছে'));
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }

          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(src);
            return;
          }

          // Fill white background for transparent PNGs so PDF doesn't have black background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, width, height);

          // Get clean JPEG data URL
          const result = canvas.toDataURL('image/jpeg', 0.92);
          resolve(result);
        } catch {
          resolve(src);
        }
      };
      img.onerror = () => reject(new Error('ছবি লোড হতে সমস্যা হয়েছে'));
      img.src = src;
    };
    reader.onerror = () => reject(new Error('ফাইল পড়া যায়নি'));
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a default Islamic University emblem image data URL using Canvas
 * so that even before user uploads, a crisp logo is always available for PDF.
 */
export function getDefaultEmblemDataUrl(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Background circle
    ctx.fillStyle = '#064e3b'; // emerald-900
    ctx.beginPath();
    ctx.arc(120, 120, 114, 0, Math.PI * 2);
    ctx.fill();

    // Inner ring
    ctx.strokeStyle = '#10b981'; // emerald-500
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(120, 120, 104, 0, Math.PI * 2);
    ctx.stroke();

    // Center circle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(120, 120, 88, 0, Math.PI * 2);
    ctx.fill();

    // Crest / Text
    ctx.fillStyle = '#064e3b';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('IU', 120, 95);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('CSE', 120, 135);

    ctx.font = 'bold 11px sans-serif';
    ctx.fillStyle = '#047857';
    ctx.fillText('KUSHTIA', 120, 160);

    return canvas.toDataURL('image/jpeg', 0.95);
  } catch {
    return '';
  }
}

/**
 * Renders Unicode / encircled characters (like ⒿⒶⓎⒺⒹ〆ⓄⓈⓂ️ⒶⓃ) onto a high-DPI canvas
 * and returns a PNG data URL, ensuring jsPDF prints exotic Unicode symbols perfectly.
 */
export function renderFancyBadgeToDataUrl(text: string): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 70;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 32px "Segoe UI Symbol", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 4, 35);

    return canvas.toDataURL('image/png');
  } catch {
    return '';
  }
}

