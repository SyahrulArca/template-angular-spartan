/**
 * Utility helper untuk pengolahan Gambar (Image), Canvas, File, dan Base64.
 */
export class ImageUtil {
  /**
   * Membaca file gambar dan mengonversinya menjadi string Base64 (Data URL).
   * Cocok digunakan untuk preview gambar sebelum di-upload.
   *
   * @example
   * const file = event.target.files[0];
   * const base64 = await ImageUtil.fileToBase64(file);
   * // Output: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
   */
  static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('File yang diberikan bukan gambar yang valid.'));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  /**
   * Mengambil dimensi asli gambar (Width & Height dalam piksel) dari File atau URL/Base64.
   *
   * @example
   * const { width, height } = await ImageUtil.getDimensions(file);
   * console.log(`Lebar: ${width}px, Tinggi: ${height}px`);
   * // Output: Lebar: 1920px, Tinggi: 1080px
   */
  static getDimensions(source: File | string): Promise<{ width: number; height: number }> {
    return new Promise(async (resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = (error) => reject(error);

      if (typeof source === 'string') {
        img.src = source;
      } else {
        img.src = URL.createObjectURL(source);
      }
    });
  }

  /**
   * Melakukan kompresi dan resize ukuran gambar secara otomatis menggunakan HTML5 Canvas.
   * Sangat berguna untuk menghemat bandwidth server sebelum gambar di-upload.
   *
   * @example
   * const compressedBlob = await ImageUtil.compressAndResize(file, {
   *   maxWidth: 1024,
   *   maxHeight: 1024,
   *   quality: 0.8,
   *   mimeType: 'image/jpeg'
   * });
   */
  static compressAndResize(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number; // 0.1 - 1.0
      mimeType?: 'image/jpeg' | 'image/png' | 'image/webp';
    } = {},
  ): Promise<Blob> {
    const { maxWidth = 1920, maxHeight = 1080, quality = 0.8, mimeType = 'image/jpeg' } = options;

    return new Promise(async (resolve, reject) => {
      try {
        const imageSrc = await ImageUtil.fileToBase64(file);
        const img = new Image();

        img.onload = () => {
          let { width, height } = img;

          // Hitung rasio aspek untuk resize otomatis
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Gagal mendapatkan konteks 2D Canvas.'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Gagal mengompresi gambar.'));
              }
            },
            mimeType,
            quality,
          );
        };

        img.onerror = (error) => reject(error);
        img.src = imageSrc;
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Mengonversi string Base64 kembali menjadi Object Blob.
   *
   * @example
   * const blob = ImageUtil.base64ToBlob('data:image/png;base64,iVBORw0...', 'image/png');
   */
  static base64ToBlob(base64Data: string, contentType: string = ''): Blob {
    const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;

    const byteCharacters = atob(cleanBase64);
    const byteArrays: BlobPart[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  }

  /**
   * Mengonversi Blob menjadi Object File (siap dikirim via FormData).
   *
   * @example
   * const file = ImageUtil.blobToFile(compressedBlob, 'avatar-compressed.jpg');
   */
  static blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, {
      type: blob.type,
      lastModified: Date.now(),
    });
  }

  /**
   * Memvalidasi apakah file yang di-upload memenuhi kriteria ukuran (MB) dan ekstensi.
   *
   * @example
   * const validation = ImageUtil.validateImage(file, {
   *   maxSizeMB: 2,
   *   allowedTypes: ['image/jpeg', 'image/png']
   * });
   *
   * if (!validation.isValid) {
   *   console.error(validation.errorMessage);
   * }
   */
  static validateImage(
    file: File,
    options: {
      maxSizeMB?: number;
      allowedTypes?: string[];
    } = {},
  ): { isValid: boolean; errorMessage: string | null } {
    const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

    if (!file) {
      return { isValid: false, errorMessage: 'File tidak ditemukan.' };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        errorMessage: `Format file harus berupa: ${allowedTypes
          .map((t) => t.replace('image/', '.'))
          .join(', ')}`,
      };
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        errorMessage: `Ukuran file melebihi batas maksimal ${maxSizeMB}MB.`,
      };
    }

    return { isValid: true, errorMessage: null };
  }

  /**
   * Membuat URL Data placeholder gambar sederhana menggunakan Canvas.
   * Sangat praktis untuk avatar fallback (Inisial nama) tanpa perlu image asset external.
   *
   * @example
   * const avatarUrl = ImageUtil.generateAvatarPlaceholder('Syahrul Setiawan', 128);
   * // Output: "data:image/png;base64,..."
   */
  static generateAvatarPlaceholder(
    name: string,
    size: number = 100,
    bgColor: string = '#2563eb',
    textColor: string = '#ffffff',
  ): string {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Draw Background Circle
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Extract Initials (misal: "Syahrul Setiawan" -> "SS")
    const words = name.trim().split(' ');
    let initials = words[0]?.[0] || '';
    if (words.length > 1) {
      initials += words[words.length - 1]?.[0] || '';
    }
    initials = initials.toUpperCase();

    // Draw Text
    ctx.fillStyle = textColor;
    ctx.font = `bold ${Math.round(size / 2.5)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, size / 2, size / 2);

    return canvas.toDataURL('image/png');
  }
}
