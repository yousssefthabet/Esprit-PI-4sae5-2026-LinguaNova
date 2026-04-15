import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CurrentProfileService {
  private readonly selectedProfileId = signal<number | null>(null);

  profileId(): number | null {
    return this.selectedProfileId();
  }

  setProfileId(id: number | null): void {
    this.selectedProfileId.set(id);
  }
}
