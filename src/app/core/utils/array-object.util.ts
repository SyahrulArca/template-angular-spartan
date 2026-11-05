/**
 * Utility helper untuk pengolahan Array dan Object.
 */
export class ArrayObjectUtil {
  /**
   * Mengelompokkan (grouping) array of objects berdasarkan key tertentu.
   *
   * @example
   * const users = [
   *   { name: 'Budi', role: 'admin' },
   *   { name: 'Siti', role: 'user' },
   *   { name: 'Andi', role: 'admin' }
   * ];
   * ArrayObjectUtil.groupBy(users, 'role');
   * // Output:
   * // {
   * //   admin: [{ name: 'Budi', role: 'admin' }, { name: 'Andi', role: 'admin' }],
   * //   user: [{ name: 'Siti', role: 'user' }]
   * // }
   */
  static groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    if (!array || !Array.isArray(array)) return {};

    return array.reduce(
      (acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
      },
      {} as Record<string, T[]>,
    );
  }

  /**
   * Menghilangkan duplikat dalam array of objects berdasarkan properti/key tertentu.
   *
   * @example
   * const items = [
   *   { id: 1, name: 'Barang A' },
   *   { id: 2, name: 'Barang B' },
   *   { id: 1, name: 'Barang A Duplikat' }
   * ];
   * ArrayObjectUtil.uniqueBy(items, 'id');
   * // Output:
   * // [
   * //   { id: 1, name: 'Barang A' },
   * //   { id: 2, name: 'Barang B' }
   * // ]
   */
  static uniqueBy<T>(array: T[], key: keyof T): T[] {
    if (!array || !Array.isArray(array)) return [];

    const seen = new Set();
    return array.filter((item) => {
      const val = item[key];
      if (seen.has(val)) {
        return false;
      }
      seen.add(val);
      return true;
    });
  }

  /**
   * Mengurutkan (sorting) array of objects berdasarkan properti/key.
   * Mendukung sorting bertingkat (ascending / descending).
   *
   * @example
   * const products = [
   *   { name: 'Laptop', price: 1000 },
   *   { name: 'Mouse', price: 50 },
   *   { name: 'Keyboard', price: 150 }
   * ];
   * ArrayObjectUtil.sortBy(products, 'price', 'desc');
   * // Output:
   * // [
   * //   { name: 'Laptop', price: 1000 },
   * //   { name: 'Keyboard', price: 150 },
   * //   { name: 'Mouse', price: 50 }
   * // ]
   */
  static sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
    if (!array || !Array.isArray(array)) return [];

    return [...array].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      let comparison = 0;
      if (typeof valA === 'string' && typeof valB === 'string') {
        comparison = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      } else {
        comparison = valA < valB ? -1 : 1;
      }

      return order === 'desc' ? comparison * -1 : comparison;
    });
  }

  /**
   * Mengubah array flat dengan relasi parent-child menjadi struktur Tree / Hierarki.
   * Cocok untuk Menu, Kategori bertingkat, atau Organization Chart.
   *
   * @example
   * const menuFlat = [
   *   { id: 1, parentId: null, title: 'Dashboard' },
   *   { id: 2, parentId: null, title: 'Settings' },
   *   { id: 3, parentId: 2, title: 'Profile' }
   * ];
   * ArrayObjectUtil.toTree(menuFlat, 'id', 'parentId');
   * // Output:
   * // [
   * //   { id: 1, parentId: null, title: 'Dashboard', children: [] },
   * //   {
   * //     id: 2,
   * //     parentId: null,
   * //     title: 'Settings',
   * //     children: [{ id: 3, parentId: 2, title: 'Profile', children: [] }]
   * //   }
   * // ]
   */
  static toTree<T extends Record<string, any>>(
    items: T[],
    idKey: keyof T = 'id',
    parentIdKey: keyof T = 'parentId',
    childrenKey: string = 'children',
  ): T[] {
    if (!items || !Array.isArray(items)) return [];

    const itemMap = new Map<any, T>();
    const rootItems: T[] = [];

    items.forEach((item) => {
      const cloned = { ...item, [childrenKey]: [] };
      itemMap.set(cloned[idKey], cloned);
    });

    itemMap.forEach((item) => {
      const parentId = item[parentIdKey];
      if (parentId !== null && parentId !== undefined && itemMap.has(parentId)) {
        itemMap.get(parentId)![childrenKey].push(item);
      } else {
        rootItems.push(item);
      }
    });

    return rootItems;
  }

  /**
   * Mengubah Array of Object menjadi Map/Dictionary (Lookup Table) berdasarkan Key.
   * Bermanfaat untuk optimasi pencarian O(1) dibanding `array.find()`.
   *
   * @example
   * const users = [
   *   { id: 'usr_1', name: 'Budi' },
   *   { id: 'usr_2', name: 'Siti' }
   * ];
   * const userMap = ArrayObjectUtil.toDictionary(users, 'id');
   * userMap.get('usr_1'); // Output: { id: 'usr_1', name: 'Budi' }
   */
  static toDictionary<T>(array: T[], key: keyof T): Map<any, T> {
    const map = new Map<any, T>();
    if (!array || !Array.isArray(array)) return map;

    array.forEach((item) => {
      map.set(item[key], item);
    });

    return map;
  }

  /**
   * Mencari/Filter item di dalam array berdasarkan text (Search Filter).
   * Melakukan pencarian case-insensitive di semua atau properti object tertentu.
   *
   * @example
   * const data = [
   *   { id: 1, name: 'Budi Santoso', email: 'budi@mail.com' },
   *   { id: 2, name: 'Siti Rahma', email: 'siti@gmail.com' }
   * ];
   *
   * // Cari di semua field:
   * ArrayObjectUtil.search(data, 'gmail');
   * // Output: [{ id: 2, name: 'Siti Rahma', email: 'siti@gmail.com' }]
   *
   * // Cari hanya di field 'name':
   * ArrayObjectUtil.search(data, 'budi', ['name']);
   * // Output: [{ id: 1, name: 'Budi Santoso', email: 'budi@mail.com' }]
   */
  static search<T extends Record<string, any>>(
    array: T[],
    searchTerm: string,
    keysToSearch?: (keyof T)[],
  ): T[] {
    if (!array || !Array.isArray(array)) return [];
    if (!searchTerm || searchTerm.trim() === '') return array;

    const term = searchTerm.toLowerCase().trim();

    return array.filter((item) => {
      const keys = keysToSearch || (Object.keys(item) as (keyof T)[]);

      return keys.some((key) => {
        const val = item[key];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      });
    });
  }

  /**
   * Melakukan deep clone pada Object / Array (menciptakan instance baru tanpa referensi).
   *
   * @example
   * const original = { name: 'App', config: { theme: 'dark' } };
   * const cloned = ArrayObjectUtil.deepClone(original);
   *
   * cloned.config.theme = 'light';
   * console.log(original.config.theme); // Tetap 'dark' (referensi terpisah)
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (typeof structuredClone === 'function') {
      return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Mengecek apakah sebuah Object atau Array kosong (`null`, `undefined`, `[]`, atau `{}`).
   *
   * @example
   * ArrayObjectUtil.isEmpty([]); // true
   * ArrayObjectUtil.isEmpty({}); // true
   * ArrayObjectUtil.isEmpty(null); // true
   * ArrayObjectUtil.isEmpty(''); // true
   * ArrayObjectUtil.isEmpty({ name: 'Budi' }); // false
   * ArrayObjectUtil.isEmpty([1, 2]); // false
   */
  static isEmpty(val: any): boolean {
    if (val === null || val === undefined) return true;
    if (Array.isArray(val) || typeof val === 'string') return val.length === 0;
    if (typeof val === 'object') return Object.keys(val).length === 0;
    return false;
  }
}
