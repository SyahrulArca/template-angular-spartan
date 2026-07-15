import { type BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Directive, input } from '@angular/core';
import { BrnLabel } from '@spartan-ng/brain/label';
import { classes, hlm } from '@spartan-ng/helm/utils';

@Directive({
  selector: '[hlmLabel]',
  hostDirectives: [{ directive: BrnLabel, inputs: ['id', 'for'] }],
  host: {
    'data-slot': 'label',
    '[attr.data-required]': 'required() ? "" : null',
  },
})
export class HlmLabel {
  /** When true, appends a red asterisk after the label text. */
  public readonly required = input<boolean, BooleanInput>(false, { transform: booleanAttribute });

  constructor() {
    classes(() =>
      hlm(
        'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
        'data-required:after:text-destructive data-required:after:ms-0.5 data-required:after:content-["*"]',
      ),
    );
  }
}
