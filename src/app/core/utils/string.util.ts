/**
 * Utility helper untuk manipulasi, format, dan transformasi String.
 */
export class StringUtil {
  /**
   * Mengubah string teks menjadi Slug URL-friendly (huruf kecil, tanpa karakter khusus, dipisahkan strip).
   *
   * @example
   * StringUtil.slugify('Judul Artikel: Panduan Angular 18!');
   * // Output: "judul-artikel-panduan-angular-18"
   */
  static slugify(text: string | null | undefined): string {
    if (!text) return '';

    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Ganti spasi dengan -
      .replace(/[^\w\-]+/g, '') // Hapus karakter khusus non-word
      .replace(/\-\-+/g, '-') // Ganti multiple - dengan single -
      .replace(/^-+/, '') // Trim - dari awal teks
      .replace(/-+$/, ''); // Trim - dari akhir teks
  }

  /**
   * Mengubah huruf pertama setiap kata menjadi kapital (Title Case).
   *
   * @example
   * StringUtil.capitalize('syahrul setiawan');
   * // Output: "Syahrul Setiawan"
   */
  static capitalize(text: string | null | undefined): string {
    if (!text) return '';

    return text
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Pemotong string dengan batas karakter tertentu dan menambahkan akhiran/ellipsis (...).
   * Menjaga kata agar tidak terpotong di tengah-tengah kata (word-safe).
   *
   * @example
   * StringUtil.truncate('Lorem ipsum dolor sit amet consectetur', 15);
   * // Output: "Lorem ipsum..."
   */
  static truncate(
    text: string | null | undefined,
    maxLength: number = 30,
    ellipsis: string = '...',
  ): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    const truncated = text.slice(0, maxLength).trim();
    // Cari spasi terakhir agar tidak memotong kata di tengah
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      return truncated.slice(0, lastSpace) + ellipsis;
    }

    return truncated + ellipsis;
  }

  /**
   * Menyensor sebagian karakter pada Email untuk privasi/keamanan UI.
   *
   * @example
   * StringUtil.maskEmail('syahrul.setiawan@gmail.com');
   * // Output: "s*****l@gmail.com"
   */
  static maskEmail(email: string | null | undefined): string {
    if (!email || !email.includes('@')) return '';

    const [user, domain] = email.split('@');
    if (user.length <= 2) {
      return `${user[0]}*@${domain}`;
    }

    const firstChar = user[0];
    const lastChar = user[user.length - 1];
    const maskedLength = user.length - 2;

    return `${firstChar}${'*'.repeat(maskedLength)}${lastChar}@${domain}`;
  }

  /**
   * Menyensor digit nomor HP / Telepon untuk privasi.
   *
   * @example
   * StringUtil.maskPhone('081234567890');
   * // Output: "0812****7890"
   */
  static maskPhone(phone: string | null | undefined, visibleDigits: number = 4): string {
    if (!phone) return '';

    const cleanPhone = phone.replace(/\D/g, ''); // Hapus karakter non-angka
    if (cleanPhone.length <= visibleDigits * 2) return phone;

    const start = cleanPhone.slice(0, visibleDigits);
    const end = cleanPhone.slice(-visibleDigits);
    const maskedLength = cleanPhone.length - visibleDigits * 2;

    return `${start}${'*'.repeat(maskedLength)}${end}`;
  }

  /**
   * Menghapus tag HTML dari string (Plain text extractor).
   * Cocok untuk membersihkan teks dari Rich Text Editor (WYSIWYG).
   *
   * @example
   * StringUtil.stripHtml('<p>Hello <strong>World</strong>!</p>');
   * // Output: "Hello World!"
   */
  static stripHtml(html: string | null | undefined): string {
    if (!html) return '';

    return html
      .replace(/<[^>]*>/g, '') // Hapus tag HTML
      .replace(/&nbsp;/g, ' ') // Replace non-breaking space
      .trim();
  }

  /**
   * Menghasilkan string acak (Random String) dengan panjang tertentu.
   * Cocok untuk membuat ID unik sementara, nonce, atau dummy data.
   *
   * @example
   * StringUtil.randomString(8);
   * // Output: "aB9xK2Lm" (acak)
   */
  static randomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    return result;
  }

  /**
   * Meng-camelCase-kan string (misal dari snake_case atau kebab-case).
   *
   * @example
   * StringUtil.toCamelCase('user_profile_setting');
   * // Output: "userProfileSetting"
   */
  static toCamelCase(str: string | null | undefined): string {
    if (!str) return '';

    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  }

  /**
   * Meng-snake_case-kan string.
   *
   * @example
   * StringUtil.toSnakeCase('userProfileSetting');
   * // Output: "user_profile_setting"
   */
  static toSnakeCase(str: string | null | undefined): string {
    if (!str) return '';

    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s\-]+/g, '_')
      .toLowerCase();
  }

  /**
   * Mengecek apakah string merupakan format UUID (v4/v1) yang valid.
   *
   * @example
   * StringUtil.isUuid('123e4567-e89b-12d3-a456-426614174000'); // true
   * StringUtil.isUuid('invalid-uuid'); // false
   */
  static isUuid(str: string | null | undefined): boolean {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  }

  /**
   * Mengecek apakah string merupakan URL yang valid.
   *
   * @example
   * StringUtil.isValidUrl('https://google.com'); // true
   * StringUtil.isValidUrl('bukan-url'); // false
   */
  static isValidUrl(str: string | null | undefined): boolean {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
}
