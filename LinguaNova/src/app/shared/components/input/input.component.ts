import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ],
    template: `
    <div class="w-full">
      @if (label) {
        <label [for]="id" class="block text-sm font-medium text-foreground mb-2">
          {{ label }}
          @if (required) {
            <span class="text-destructive ml-1">*</span>
          }
        </label>
      }
      
      <div class="relative">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [value]="value"
          [class]="inputClasses"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
        
        @if (error) {
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-destructive" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </div>
        }
      </div>
      
      @if (error) {
        <p class="mt-2 text-sm text-destructive">{{ error }}</p>
      }
      
      @if (hint && !error) {
        <p class="mt-2 text-sm text-muted-foreground">{{ hint }}</p>
      }
    </div>
  `,
    styles: []
})
export class InputComponent implements ControlValueAccessor {
    @Input() id = `input-${Math.random().toString(36).substr(2, 9)}`;
    @Input() label = '';
    @Input() type: string = 'text';
    @Input() placeholder = '';
    @Input() error = '';
    @Input() hint = '';
    @Input() required = false;
    @Input() disabled = false;

    value = '';
    onChange: any = () => { };
    onTouched: any = () => { };

    get inputClasses(): string {
        const baseClasses = 'block w-full px-4 py-2.5 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed';
        const errorClasses = this.error ? 'border-destructive focus:ring-destructive pr-10' : 'border-border';

        return `${baseClasses} ${errorClasses}`;
    }

    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.value = input.value;
        this.onChange(this.value);
    }

    writeValue(value: any): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
