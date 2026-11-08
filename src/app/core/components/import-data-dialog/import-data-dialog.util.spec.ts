import { validateImportDataFile } from './import-data-dialog.util';

describe('validateImportDataFile', () => {
  const max = 1024;

  it('accepts a valid xlsx file', () => {
    const file = new File(['a'], 'data.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(validateImportDataFile(file, '.xlsx,.xls', max)).toBeNull();
  });

  it('rejects wrong extension', () => {
    const file = new File(['a'], 'data.csv', { type: 'text/csv' });
    expect(validateImportDataFile(file, '.xlsx,.xls', max)).toMatch(/must be/);
  });

  it('rejects oversize files', () => {
    const file = new File([new Uint8Array(max + 1)], 'big.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(validateImportDataFile(file, '.xlsx', max)).toMatch(/maximum size/);
  });
});
