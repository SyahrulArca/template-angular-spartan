/**
 * Utility helper untuk manipulasi, format, dan kalkulasi Tanggal/Waktu.
 */
export class DateUtil {
  /**
   * Mengubah input tanggal (Date / string ISO / timestamp number) menjadi format tanggal lokal.
   * Default: Bahasa Indonesia (id-ID) dengan format "28 Juli 2026".
   *
   * @example
   * DateUtil.formatDate('2026-07-28');
   * // Output: "28 Juli 2026"
   *
   * DateUtil.formatDate(new Date(), 'en-US');
   * // Output: "July 28, 2026"
   */
  static formatDate(
    dateInput: Date | string | number | null | undefined,
    locale: string = 'id-ID',
    options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    },
  ): string {
    const date = DateUtil.parseDate(dateInput);
    if (!date) return '';

    return new Intl.DateTimeFormat(locale, options).format(date);
  }

  /**
   * Format tanggal beserta jam/waktu.
   *
   * @example
   * DateUtil.formatDateTime('2026-07-28T17:30:00Z');
   * // Output: "28 Juli 2026, 17.30"
   */
  static formatDateTime(
    dateInput: Date | string | number | null | undefined,
    locale: string = 'id-ID',
  ): string {
    return DateUtil.formatDate(dateInput, locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  /**
   * Mengubah tanggal menjadi format Waktu Relatif / Relative Time ("x menit yang lalu", "kemarin", dll).
   *
   * @example
   * const limaMenitLalu = new Date(Date.now() - 5 * 60 * 1000);
   * DateUtil.timeAgo(limaMenitLalu);
   * // Output: "5 menit yang lalu"
   *
   * const besok = new Date(Date.now() + 24 * 60 * 60 * 1000);
   * DateUtil.timeAgo(besok);
   * // Output: "dalam 1 hari"
   */
  static timeAgo(
    dateInput: Date | string | number | null | undefined,
    locale: string = 'id-ID',
  ): string {
    const date = DateUtil.parseDate(dateInput);
    if (!date) return '';

    const now = new Date();
    const secondsDiff = Math.round((date.getTime() - now.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    const cutoffs = [
      { unit: 'year', value: 31536000 },
      { unit: 'month', value: 2592000 },
      { unit: 'week', value: 604800 },
      { unit: 'day', value: 86400 },
      { unit: 'hour', value: 3600 },
      { unit: 'minute', value: 60 },
      { unit: 'second', value: 1 },
    ] as const;

    for (const unit of cutoffs) {
      if (Math.abs(secondsDiff) >= unit.value || unit.unit === 'second') {
        return rtf.format(Math.round(secondsDiff / unit.value), unit.unit);
      }
    }

    return '';
  }

  /**
   * Mengonversi Date ke format ISO String untuk kirim ke Backend API (YYYY-MM-DD).
   *
   * @example
   * DateUtil.toApiDate(new Date(2026, 6, 28));
   * // Output: "2026-07-28"
   */
  static toApiDate(dateInput: Date | string | number | null | undefined): string {
    const date = DateUtil.parseDate(dateInput);
    if (!date) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Menghitung selisih jumlah hari antara dua tanggal.
   *
   * @example
   * DateUtil.diffInDays('2026-07-01', '2026-07-28');
   * // Output: 27
   */
  static diffInDays(
    startDateInput: Date | string | number,
    endDateInput: Date | string | number,
  ): number {
    const start = DateUtil.parseDate(startDateInput);
    const end = DateUtil.parseDate(endDateInput);

    if (!start || !end) return 0;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Mengecek apakah tanggal berada di hari ini (Today).
   *
   * @example
   * DateUtil.isToday(new Date()); // true
   * DateUtil.isToday('2020-01-01'); // false
   */
  static isToday(dateInput: Date | string | number | null | undefined): boolean {
    const date = DateUtil.parseDate(dateInput);
    if (!date) return false;

    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  /**
   * Menambahkan/Mengurangi jumlah hari dari suatu tanggal.
   *
   * @example
   * const hariIni = new Date('2026-07-28');
   * DateUtil.addDays(hariIni, 5); // Output: Date Object (2026-08-02)
   * DateUtil.addDays(hariIni, -3); // Output: Date Object (2026-07-25)
   */
  static addDays(dateInput: Date | string | number, days: number): Date {
    const date = DateUtil.parseDate(dateInput) || new Date();
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Mengambil tanggal awal bulan (Start of Month) dan akhir bulan (End of Month).
   * Sangat berguna untuk kalkulasi filter laporan/date-range picker.
   *
   * @example
   * const { start, end } = DateUtil.getMonthBounds('2026-07-15');
   * // start: 2026-07-01T00:00:00.000Z
   * // end: 2026-07-31T23:59:59.999Z
   */
  static getMonthBounds(dateInput: Date | string | number | null | undefined): {
    start: Date;
    end: Date;
  } {
    const date = DateUtil.parseDate(dateInput) || new Date();

    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

    return { start, end };
  }

  /**
   * Safe parser untuk mengonversi berbagai jenis input menjadi instance Object `Date`.
   *
   * @example
   * DateUtil.parseDate('2026-07-28'); // Date object
   * DateUtil.parseDate(1722123456789); // Date object
   * DateUtil.parseDate('invalid-date'); // null
   */
  static parseDate(dateInput: Date | string | number | null | undefined): Date | null {
    if (!dateInput) return null;

    if (dateInput instanceof Date) {
      return isNaN(dateInput.getTime()) ? null : dateInput;
    }

    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
}
