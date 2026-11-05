import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormShellMasterDetail } from './form-shell-master-detail';
import { FormShellSingle } from './form-shell-single';

@Component({
  imports: [ReactiveFormsModule, FormShellSingle, FormShellMasterDetail],
  template: `
    <form
      id="single"
      appFormShellSingle
      title="Single"
      [formGroup]="form"
      [submitting]="submitting()"
      (ngSubmit)="submits = submits + 1"
      (cancelled)="cancels = cancels + 1"
    >
      <input formControlName="name" />
    </form>

    <form id="md" appFormShellMasterDetail title="Master" detailTitle="Lines" [formGroup]="form">
      <input id="master-field" formControlName="name" />
      <button formShellDetailActions type="button">Add</button>
      <div formShellDetail id="detail-body">rows</div>
    </form>
  `,
})
class Host {
  readonly form = new FormGroup({ name: new FormControl('a', { nonNullable: true }) });
  readonly submitting = signal(false);
  submits = 0;
  cancels = 0;
}

describe('FormShell', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    return { fixture, host: fixture.componentInstance, root };
  }

  it('single: projects fields, labels the form, submits and cancels', () => {
    const { host, root } = setup();
    const form = root.querySelector<HTMLFormElement>('#single')!;
    const [cancel, submit] = [
      ...form.querySelectorAll<HTMLButtonElement>('[data-slot=card-footer] button'),
    ];

    expect(form.querySelector('[data-slot=card-content] input')).toBeTruthy();
    expect(document.getElementById(form.getAttribute('aria-labelledby')!)?.textContent).toBe(
      'Single',
    );

    submit.click();
    cancel.click();
    expect(host.submits).toBe(1);
    expect(host.cancels).toBe(1);
  });

  it('single: disables both buttons while submitting', () => {
    const { fixture, host, root } = setup();
    host.submitting.set(true);
    fixture.detectChanges();

    const buttons = root.querySelectorAll<HTMLButtonElement>(
      '#single [data-slot=card-footer] button',
    );
    expect([...buttons].every((b) => b.disabled)).toBe(true);
    expect(root.querySelector('#single hlm-spinner')).toBeTruthy();
  });

  it('master-detail: master fields on top, detail slot and actions in the detail section', () => {
    const { root } = setup();
    const section = root.querySelector('#md section')!;

    expect(root.querySelector('#md [data-slot=card-content] #master-field')).toBeTruthy();
    expect(section.querySelector('h3')?.textContent).toBe('Lines');
    expect(section.querySelector('#detail-body')).toBeTruthy();
    expect(section.querySelector('button')?.textContent).toBe('Add');
  });
});
