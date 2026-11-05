import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SearchInput } from './search-input';

@Component({
  imports: [SearchInput],
  template: `<app-search-input [(value)]="query" />`,
})
class Host {
  readonly query = signal('');
}

describe('SearchInput', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const type = (text: string) => {
      input.value = text;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { fixture, host: fixture.componentInstance, input, type };
  }

  it('emits only after the debounce delay', () => {
    const { host, type } = setup();

    type('gla');
    vi.advanceTimersByTime(299);
    expect(host.query()).toBe('');

    vi.advanceTimersByTime(1);
    expect(host.query()).toBe('gla');
  });

  it('clears immediately from the clear button', () => {
    const { fixture, host, input, type } = setup();
    type('gla');
    vi.advanceTimersByTime(300);

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();

    expect(host.query()).toBe('');
    expect(input.value).toBe('');
  });

  it('reflects values set from outside', () => {
    const { fixture, host, input } = setup();

    host.query.set('paid');
    fixture.detectChanges();

    expect(input.value).toBe('paid');
  });
});
