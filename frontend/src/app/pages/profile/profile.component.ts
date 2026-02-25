import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentProfileService } from '../../services/student-profile.service';
import type { StudentProfile } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  profiles = signal<StudentProfile[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  saving = signal(false);
  saveError = signal<string | null>(null);
  formVisible = signal(false);
  editId = signal<number | null>(null);

  form = signal<Partial<StudentProfile>>({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
  });

  constructor(private profileService: StudentProfileService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.profileService.getAll().subscribe({
      next: (list) => {
        this.profiles.set(list);
        this.loading.set(false);
        this.error.set(null);
      },
      error: (err) => {
        this.loading.set(false);
        
        // Extraire le message d'erreur du backend
        let errorMessage = 'Impossible de charger les profils.';
        
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
        } else if (err.status === 404) {
          errorMessage = 'L\'API des profils est introuvable.';
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.error.set(errorMessage);
      },
    });
  }

  openCreate(): void {
    this.editId.set(null);
    this.form.set({ firstName: '', lastName: '', phone: '', birthDate: '' });
    this.formVisible.set(true);
    this.saveError.set(null);
  }

  openEdit(p: StudentProfile): void {
    this.editId.set(p.id!);
    this.form.set({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      birthDate: p.birthDate,
    });
    this.formVisible.set(true);
    this.saveError.set(null);
  }

  cancel(): void {
    this.formVisible.set(false);
    this.editId.set(null);
    this.saveError.set(null);
  }

  save(): void {
    const f = this.form();
    if (!f.firstName?.trim() || !f.lastName?.trim() || !f.phone?.trim() || !f.birthDate) {
      this.saveError.set('Tous les champs sont obligatoires.');
      return;
    }
    
    // Validation de format du téléphone
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!phoneRegex.test(f.phone.trim())) {
      this.saveError.set('Le numéro de téléphone doit contenir entre 8 et 15 chiffres.');
      return;
    }
    
    // Validation de la date de naissance
    const birthDate = new Date(f.birthDate);
    const today = new Date();
    if (birthDate >= today) {
      this.saveError.set('La date de naissance doit être dans le passé.');
      return;
    }
    
    this.saving.set(true);
    this.saveError.set(null);
    const payload: StudentProfile = {
      firstName: f.firstName.trim(),
      lastName: f.lastName.trim(),
      phone: f.phone.trim(),
      birthDate: f.birthDate,
    };
    const id = this.editId();
    const req = id
      ? this.profileService.update(id, payload)
      : this.profileService.create(payload);
    req.subscribe({
      next: () => {
        this.saving.set(false);
        this.formVisible.set(false);
        this.editId.set(null);
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        
        // Extraire le message d'erreur du backend
        let errorMessage = 'Erreur lors de l\'enregistrement.';
        
        if (err.error && err.error.message) {
          errorMessage = err.error.message;
        } else if (err.error && err.error.errors) {
          // Erreurs de validation
          const validationErrors = err.error.errors;
          const errorMessages = Object.keys(validationErrors)
            .map(key => `${key}: ${validationErrors[key]}`)
            .join(', ');
          errorMessage = `Erreurs de validation: ${errorMessages}`;
        } else if (err.message) {
          errorMessage = err.message;
        }
        
        this.saveError.set(errorMessage);
      },
    });
  }

  delete(p: StudentProfile): void {
    if (!p.id) return;
    if (!confirm(`Supprimer le profil de ${p.firstName} ${p.lastName} ?`)) return;
    this.profileService.delete(p.id).subscribe({
      next: () => this.load(),
      error: () => {},
    });
  }

  setFormField(field: keyof StudentProfile, value: string): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }
}
