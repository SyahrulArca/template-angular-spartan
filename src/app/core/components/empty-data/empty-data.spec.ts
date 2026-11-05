import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EmptyData } from './empty-data';

@Component({
  imports: [EmptyData],
  template: `<app-empty-data><button type="button">Reset filter</button></app-empty-data>`,
})
class Host {}

describe('EmptyData', () => {
  it('renders the asset, title, description, then projected actions in order', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const column = root.querySelector('app-empty-data > div')!;

    expect(root.querySelector('img')?.getAttribute('src')).toContain(
      'assets/images/empty-page-asset.svg',
    );
    expect(root.querySelector('h2')?.textContent?.trim()).toBe('Empty Data');
    expect(root.querySelector('p')?.textContent).toContain("There's no data to display.");
    expect([...column.children].map((el) => el.tagName)).toEqual(['IMG', 'DIV', 'DIV']);
    expect(column.lastElementChild?.querySelector('button')?.textContent).toBe('Reset filter');
  });
});
