import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CalendarDayColumn,
  NewAppointmentPayload,
  PacienteApiDto,
} from '../../../../core/models';
import { ModalShellComponent } from '../../../../shared/components/modal/modal-shell.component';

interface AppointmentFormControls {
  patientId: FormControl<string>;
  patientName: FormControl<string>;
  dayIndex: FormControl<number>;
  hourSlot: FormControl<string>;
  modality: FormControl<'Telessaúde' | 'Presencial'>;
  roomOrNotes: FormControl<string>;
}

@Component({
  selector: 'app-appointment-modal',
  standalone: true,
  imports: [ReactiveFormsModule, ModalShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-modal-shell
      [isOpen]="isOpen()"
      title="Agendar Novo Horário Clínico"
      subtitle="Sincronizado com sala criptografada e lembrete automático"
      icon="calendar_add_on"
      modalTitleId="appointment-modal-title"
      (closed)="closed.emit()"
    >
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-space-md" novalidate>
        @if (patients().length > 0) {
          <div class="flex flex-col gap-1">
            <label for="appt-patient-select" class="font-label-md text-label-md text-on-surface">
              Paciente Cadastrado *
            </label>
            <select
              id="appt-patient-select"
              formControlName="patientId"
              (change)="onPatientSelected()"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">-- Selecione um paciente --</option>
              @for (p of patients(); track p.idPaciente) {
                <option [value]="p.idPaciente">{{ p.nome }} ({{ p.cpf }})</option>
              }
            </select>
          </div>
        }

        <div class="flex flex-col gap-1">
          <label for="appt-patient" class="font-label-md text-label-md text-on-surface">
            Nome do Paciente *
          </label>
          <input
            id="appt-patient"
            type="text"
            formControlName="patientName"
            placeholder="Ex.: Mariana Torres Nogueira"
            class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
          @if (form.controls.patientName.invalid && form.controls.patientName.touched) {
            <span class="text-label-sm font-label-sm text-error">
              Informe o nome do paciente (mínimo 3 caracteres).
            </span>
          }
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label for="appt-day" class="font-label-md text-label-md text-on-surface">
              Dia da Semana *
            </label>
            <select
              id="appt-day"
              formControlName="dayIndex"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              @for (day of days(); track day.index) {
                <option [ngValue]="day.index">
                  {{ day.shortDayLabel }} ({{ day.dateNumberLabel }})
                </option>
              }
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label for="appt-hour" class="font-label-md text-label-md text-on-surface">
              Horário (50 min) *
            </label>
            <select
              id="appt-hour"
              formControlName="hourSlot"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              @for (hour of selectableHours; track hour) {
                <option [value]="hour">{{ hour }}</option>
              }
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-space-md">
          <div class="flex flex-col gap-1">
            <label for="appt-modality" class="font-label-md text-label-md text-on-surface">
              Modalidade *
            </label>
            <select
              id="appt-modality"
              formControlName="modality"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Telessaúde">Telessaúde (Online CFP)</option>
              <option value="Presencial">Presencial (Consultório)</option>
            </select>
          </div>

          <div class="flex flex-col gap-1">
            <label for="appt-room" class="font-label-md text-label-md text-on-surface">
              Sala / Observação
            </label>
            <input
              id="appt-room"
              type="text"
              formControlName="roomOrNotes"
              placeholder="Sala 1"
              class="w-full h-11 px-space-md rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-space-sm pt-space-xs">
          <button
            type="button"
            (click)="closed.emit()"
            class="px-space-md py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-container font-label-lg text-label-lg transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-space-lg py-2.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container shadow-md flex items-center gap-space-xs transition-all cursor-pointer"
          >
            <span class="material-symbols-outlined text-[18px]">check</span>
            Confirmar Agendamento
          </button>
        </div>
      </form>
    </app-modal-shell>
  `,
})
export class AppointmentModalComponent {
  public readonly isOpen = input.required<boolean>();
  public readonly days = input.required<readonly CalendarDayColumn[]>();
  public readonly patients = input<readonly PacienteApiDto[]>([]);
  public readonly closed = output<void>();
  public readonly appointmentCreated = output<NewAppointmentPayload>();

  public readonly selectableHours: readonly string[] = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ];

  public readonly form = new FormGroup<AppointmentFormControls>({
    patientId: new FormControl<string>('', { nonNullable: true }),
    patientName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    dayIndex: new FormControl<number>(3, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    hourSlot: new FormControl<string>('16:00', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    modality: new FormControl<'Telessaúde' | 'Presencial'>('Telessaúde', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    roomOrNotes: new FormControl<string>('Sala 1', { nonNullable: true }),
  });

  public onPatientSelected(): void {
    const selectedId = this.form.controls.patientId.value;
    const found = this.patients().find((p) => p.idPaciente === selectedId);
    if (found) {
      this.form.controls.patientName.setValue(found.nome);
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const hourPrefix = raw.hourSlot.slice(0, 2);
    this.appointmentCreated.emit({
      patientId: raw.patientId || undefined,
      patientName: raw.patientName,
      dayIndex: raw.dayIndex,
      hourSlot: raw.hourSlot,
      timeRange: `${hourPrefix}:00 - ${hourPrefix}:50`,
      modality: raw.modality,
      roomOrNotes: raw.roomOrNotes,
    });
    this.form.reset({
      patientId: '',
      patientName: '',
      dayIndex: 3,
      hourSlot: '16:00',
      modality: 'Telessaúde',
      roomOrNotes: 'Sala 1',
    });
  }
}
