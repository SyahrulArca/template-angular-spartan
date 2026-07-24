import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import {
  NegativeNumberBehavior,
  TemplateFormatNumber,
  negativeNumberBehavior,
  templateFormatNumber,
} from '../constanta/number-template';

const STORAGE_FORMAT_KEY = 'number_format_key';
const STORAGE_NEGATIVE_KEY = 'number_negative_key';

@Injectable({ providedIn: 'root' })
export class NumberFormatContextService {
  private readonly platformId = inject(PLATFORM_ID);

  // Private Writable Signals
  private readonly selectedFormat = signal<TemplateFormatNumber>(templateFormatNumber[0]);
  private readonly selectedNegativeBehavior = signal<NegativeNumberBehavior>(negativeNumberBehavior[0]);

  // Readonly Signals (Di-expose ke publik)
  readonly format = this.selectedFormat.asReadonly();
  readonly negativeBehavior = this.selectedNegativeBehavior.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Load saved format key
    const savedFormatKey = localStorage.getItem(STORAGE_FORMAT_KEY);
    if (savedFormatKey) {
      const foundFormat = templateFormatNumber.find((item) => item.key === savedFormatKey);
      if (foundFormat) this.selectedFormat.set(foundFormat);
    }

    // Load saved negative behavior key
    const savedNegativeKey = localStorage.getItem(STORAGE_NEGATIVE_KEY);
    if (savedNegativeKey) {
      const foundNegative = negativeNumberBehavior.find((item) => item.key === savedNegativeKey);
      if (foundNegative) this.selectedNegativeBehavior.set(foundNegative);
    }
  }

  // --- Actions ---

  setFormat(key: string): void {
    const found = templateFormatNumber.find((item) => item.key === key);
    if (found) {
      this.selectedFormat.set(found);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_FORMAT_KEY, key);
      }
    }
  }

  setNegativeBehavior(key: string): void {
    const found = negativeNumberBehavior.find((item) => item.key === key);
    if (found) {
      this.selectedNegativeBehavior.set(found);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(STORAGE_NEGATIVE_KEY, key);
      }
    }
  }

  // --- Pure Utility Formatter ---

  formatNumber(
    value: number | null | undefined,
    customFormat?: string | TemplateFormatNumber, // 💡 Menerima string key ATAU object
    withDecimal: boolean = false,
    customNegativeKey?: string
  ): { formattedText: string; colorClass: string } {
    if (value === null || value === undefined || isNaN(value)) {
      return { formattedText: '-', colorClass: '' };
    }

    // 1. Resolve Active Format (Bisa dari string key, object, atau signal context)
    let activeFormat = this.selectedFormat();
    if (typeof customFormat === 'string') {
      const found = templateFormatNumber.find((item) => item.key === customFormat);
      if (found) activeFormat = found;
    } else if (customFormat) {
      activeFormat = customFormat;
    }

    // 2. Resolve Negative Behavior
    let activeNegative = this.selectedNegativeBehavior();
    if (customNegativeKey) {
      const found = negativeNumberBehavior.find((item) => item.key === customNegativeKey);
      if (found) activeNegative = found;
    }

    const isNegative = value < 0;

    // 3. Tentukan Nilai Absolut / Asli
    const rawValue = activeNegative.template.absoluteValue || (isNegative && activeNegative.template.brackets)
      ? Math.abs(value)
      : value;

    // 4. Format Ribuan dan Desimal
    const decimalPlaces = withDecimal ? activeFormat.template.decimal_places : 0;
    const { thousand_separator, decimal_separator } = activeFormat.template;

    // Output 'en-US' selalu menggunakan ',' untuk ribuan dan '.' untuk desimal
    let formattedText = rawValue.toLocaleString('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    });

    // 💡 SOLUSI AMAN REPLACING SEPARATOR (Pakai placeholder biar gak bentrok/ter-overwrite saat swap)
    formattedText = formattedText
      .replace(/,/g, '__THOUSAND__')
      .replace(/\./g, '__DECIMAL__')
      .replace(/__THOUSAND__/g, thousand_separator)
      .replace(/__DECIMAL__/g, decimal_separator);

    // 5. Terapkan Brackets jika angka negatif
    if (isNegative && activeNegative.template.brackets) {
      formattedText = `(${formattedText})`;
    }

    // 6. Class Warna
    const colorClass = isNegative && activeNegative.template.color === 'danger' ? 'text-red-500' : '';

    return { formattedText, colorClass };
  }
}
