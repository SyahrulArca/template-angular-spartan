import {
  appGlobalSearchItems,
  filterAppGlobalSearch,
  highlightAppGlobalSearch,
} from './app-global-search';

describe('app-global-search', () => {
  it('builds pages from the sidebar menu, modules from header products, plus actions', () => {
    const ids = appGlobalSearchItems.map((item) => item.id);

    expect(ids).toContain('page:/dashboard');
    expect(ids).toContain('page:/tasks');
    expect(ids).toContain('module:inventory');
    expect(ids).toContain('action:toggle-theme');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('filters case-insensitively on title, subtitle and meta; blank query returns all', () => {
    expect(filterAppGlobalSearch(appGlobalSearchItems, '  ')).toHaveLength(
      appGlobalSearchItems.length,
    );
    expect(filterAppGlobalSearch(appGlobalSearchItems, 'TASK').map((i) => i.id)).toEqual([
      'page:/tasks',
      'module:tasks',
    ]);
    expect(
      filterAppGlobalSearch(appGlobalSearchItems, '/settings').some(
        (i) => i.id === 'page:/settings',
      ),
    ).toBe(true);
    expect(filterAppGlobalSearch(appGlobalSearchItems, 'zzz')).toEqual([]);
  });

  it('highlights every occurrence, keeping original casing', () => {
    expect(highlightAppGlobalSearch('Forklift fork', 'FORK')).toEqual([
      { text: 'Fork', match: true },
      { text: 'lift ', match: false },
      { text: 'fork', match: true },
    ]);
    expect(highlightAppGlobalSearch('Dashboard', '')).toEqual([
      { text: 'Dashboard', match: false },
    ]);
  });
});
