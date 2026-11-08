import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  input,
  linkedSignal,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideDownload, lucideFileSpreadsheet, lucideTrash2, lucideUpload } from '@ng-icons/lucide';
import { BrnDialogState } from '@spartan-ng/brain/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import {
  formatImportFileSize,
  supportedExtensionsLabel,
  validateImportDataFile,
} from './import-data-dialog.util';

@Component({
  selector: 'app-import-data-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDialogImports, HlmButtonImports, HlmSpinner, NgIcon],
  providers: [provideIcons({ lucideDownload, lucideUpload, lucideFileSpreadsheet, lucideTrash2 })],
  templateUrl: './import-data-dialog.component.html',
  host: {
    '(dragover)': 'onHostDragOver($event)',
    '(drop)': 'onHostDrop($event)',
  },
})
export class ImportDataDialogComponent {
  readonly open = model(false);
  readonly title = input('Import Data');
  readonly description = input('Download the template and upload your Excel file.');
  readonly onDownloadTemplate = input<(() => void | Promise<void>) | undefined>(undefined);
  readonly onUploaded = input.required<(file: File) => void | Promise<void>>();
  readonly accept = input('.xlsx,.xls');
  readonly maxFileSize = input(5 * 1024 * 1024);
  readonly loading = input(false, { transform: booleanAttribute });
  readonly uploadLabel = input('Upload');
  readonly downloadLabel = input('Download Template');

  private readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  protected readonly dialogState = linkedSignal<BrnDialogState>(() =>
    this.open() ? 'open' : 'closed',
  );

  protected readonly selectedFile = signal<File | null>(null);
  protected readonly validationError = signal<string | null>(null);
  protected readonly dragOver = signal(false);
  private readonly uploadInFlight = signal(false);

  protected readonly showDownloadSection = computed(() => this.onDownloadTemplate() !== undefined);
  protected readonly acceptedFormatsLabel = computed(() => supportedExtensionsLabel(this.accept()));
  protected readonly maxSizeLabel = computed(() => formatImportFileSize(this.maxFileSize()));
  protected readonly busy = computed(() => this.loading() || this.uploadInFlight());
  protected readonly canUpload = computed(
    () => !!this.selectedFile() && !this.validationError() && !this.busy(),
  );

  protected onDialogStateChanged(state: BrnDialogState): void {
    const isOpen = state === 'open';
    this.open.set(isOpen);
    this.dialogState.set(state);
    if (!isOpen) {
      this.clearFileSelection();
    }
  }

  protected onHostDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onHostDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected onDropzoneDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.busy()) return;
    this.dragOver.set(true);
  }

  protected onDropzoneDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
  }

  protected onDropzoneDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.dragOver.set(false);
    if (this.busy()) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.applyFile(file);
  }

  protected openFilePicker(): void {
    if (this.busy()) return;
    this.fileInputRef().nativeElement.click();
  }

  protected onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.applyFile(file);
  }

  protected removeFile(): void {
    if (this.busy()) return;
    this.clearFileSelection();
  }

  protected cancel(): void {
    if (this.busy()) return;
    this.open.set(false);
    this.clearFileSelection();
  }

  protected downloadTemplate(): void {
    const handler = this.onDownloadTemplate();
    if (!handler || this.busy()) return;
    void handler();
  }

  protected async submitUpload(): Promise<void> {
    const file = this.selectedFile();
    if (!file || this.busy()) return;

    this.uploadInFlight.set(true);
    try {
      await this.onUploaded()(file);
    } finally {
      this.uploadInFlight.set(false);
    }
  }

  protected selectedFileSizeLabel(): string {
    const file = this.selectedFile();
    return file ? formatImportFileSize(file.size) : '';
  }

  private applyFile(file: File): void {
    const error = validateImportDataFile(file, this.accept(), this.maxFileSize());
    if (error) {
      this.validationError.set(error);
      this.selectedFile.set(null);
    } else {
      this.validationError.set(null);
      this.selectedFile.set(file);
    }
    this.resetFileInput();
  }

  private clearFileSelection(): void {
    this.selectedFile.set(null);
    this.validationError.set(null);
    this.dragOver.set(false);
    this.resetFileInput();
  }

  private resetFileInput(): void {
    const input = this.fileInputRef().nativeElement;
    input.value = '';
  }
}
