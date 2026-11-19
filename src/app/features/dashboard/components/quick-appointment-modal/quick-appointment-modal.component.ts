import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PacienteApiDto, QuickAppointmentFormPayload } from '../../../../core/models';
import { ClinicalStoreService } from '../../../../core/services/clinical-store.service';

@Component({
  selector: 'app-quick-appointment-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div
        aria-modal="true"
        role="dialog"
        id="modal-novo-agendamento"
        (click)="onBackdropClick($event)"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm overflow-y-auto"
      >
        <div
          class="relative w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-surface-container overflow-hidden my-auto"
        >
          <!-- Header -->
          <div class="flex items-start justify-between p-space-lg border-b border-surface-container bg-surface-bright">
            <div class="flex items-start gap-space-sm">
              <div class="w-11 h-11 rounded-xl bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 shadow-sm">
                <span class="material-symbols-outlined text-[24px]">event_available</span>
              </div>
              <div class="flex flex-col">
                <h3 class="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Novo Agendamento Clínico
                </h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Cadastro de consulta com link seguro e conciliação financeira automática.
                </p>
              </div>
            </div>
            <button
              type="button"
              (click)="closed.emit()"
              title="Fechar modal"
              class="w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
            >
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
            <!-- Scrollable Body -->
            <div class="p-space-lg flex flex-col gap-space-md max-h-[75vh] overflow-y-auto">
              <!-- SEÇÃO PACIENTE -->
              @if (patientMode() === 'existing') {
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center justify-between">
                    <label class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-primary text-[16px]">person</span>
                      <span>Paciente</span>
                    </label>
                    <button
                      type="button"
                      id="btn-switch-new-patient"
                      (click)="switchToNewPatient()"
                      class="text-primary hover:underline font-label-sm text-label-sm font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[14px]">person_add</span>
                      <span>+ Novo Paciente</span>
                    </button>
                  </div>

                  @if (selectedPatient(); as pac) {
                    <div class="p-space-sm rounded-xl border border-primary/40 bg-primary/5 flex items-center justify-between gap-space-sm">
                      <div class="flex items-center gap-space-sm">
                        <img
                          [src]="pac.avatarUrl || defaultAvatar"
                          [alt]="pac.nome"
                          class="w-10 h-10 rounded-full object-cover shadow-sm shrink-0"
                        />
                        <div class="flex flex-col">
                          <span class="font-label-lg text-label-lg text-on-surface font-bold">
                            {{ pac.nome }}
                          </span>
                          <span class="font-label-sm text-label-sm text-on-surface-variant">
                            CPF {{ maskCpf(pac.cpf) }} • Prontuário #{{ pac.idPaciente.slice(0, 4).toUpperCase() }}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        (click)="togglePatientSelector()"
                        title="Trocar paciente"
                        class="text-on-surface-variant hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-container-high cursor-pointer"
                      >
                        <span class="material-symbols-outlined text-[18px]">swap_horiz</span>
                      </button>
                    </div>
                  }

                  @if (showPatientDropdown() || !selectedPatient()) {
                    <select
                      formControlName="patientId"
                      (change)="onPatientDropdownChange()"
                      class="w-full h-11 px-3 rounded-xl bg-surface-container-low border border-outline-variant/60 text-on-surface font-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">-- Selecione um paciente cadastrado --</option>
                      @for (p of patients(); track p.idPaciente) {
                        <option [value]="p.idPaciente">{{ p.nome }} ({{ maskCpf(p.cpf) }})</option>
                      }
                    </select>
                  }
                </div>
              } @else {
                <!-- MODO CADASTRO RÁPIDO DE PACIENTE -->
                <div class="flex flex-col gap-2 rounded-xl border-2 border-primary/40 bg-surface-bright p-3.5 shadow-sm">
                  <div class="flex items-center justify-between pb-2 border-b border-surface-container">
                    <div class="flex items-center gap-2">
                      <span class="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                        <span class="material-symbols-outlined text-[18px]">person_add</span>
                      </span>
                      <div class="flex flex-col">
                        <span class="font-label-md text-label-md text-on-surface font-bold">
                          Cadastro Rápido de Paciente
                        </span>
                        <span class="text-[11px] text-on-surface-variant">
                          Preencha os dados essenciais para vincular imediatamente à consulta.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      id="btn-switch-existing-patient"
                      (click)="switchToExistingPatient()"
                      class="inline-flex items-center gap-1 text-primary hover:text-primary-container font-label-sm text-label-sm font-semibold transition-colors px-2 py-1 rounded-lg hover:bg-surface-container-high cursor-pointer"
                    >
                      <span class="material-symbols-outlined text-[16px]">arrow_back</span>
                      <span>Selecionar Existente</span>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-1">
                    <div class="sm:col-span-2 flex flex-col gap-1">
                      <label class="font-label-sm text-[11px] text-on-surface font-semibold flex items-center justify-between">
                        <span>Nome Completo do Paciente *</span>
                        <span class="text-on-surface-variant font-normal text-[11px]">Nome social / registro civil</span>
                      </label>
                      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-primary text-on-surface font-body-sm shadow-sm ring-1 ring-primary/30">
                        <span class="material-symbols-outlined text-[18px] text-primary">badge</span>
                        <input
                          type="text"
                          formControlName="newFullName"
                          placeholder="Nome completo do paciente"
                          class="w-full bg-transparent outline-none text-on-surface font-medium placeholder:text-on-surface-variant/60"
                        />
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="font-label-sm text-[11px] text-on-surface font-semibold">
                        CPF (Obrigatório para Prontuário CFP) *
                      </label>
                      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-body-sm">
                        <span class="material-symbols-outlined text-[18px] text-on-surface-variant">fingerprint</span>
                        <input
                          type="text"
                          formControlName="newCpf"
                          placeholder="000.000.000-00"
                          class="w-full bg-transparent outline-none text-on-surface font-medium"
                        />
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="font-label-sm text-[11px] text-on-surface font-semibold">
                        Data de Nascimento
                      </label>
                      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-body-sm">
                        <span class="material-symbols-outlined text-[18px] text-on-surface-variant">cake</span>
                        <input
                          type="text"
                          formControlName="newBirthDate"
                          placeholder="DD/MM/AAAA"
                          class="w-full bg-transparent outline-none text-on-surface font-medium"
                        />
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="font-label-sm text-[11px] text-on-surface font-semibold">
                        Telefone / WhatsApp com DDD *
                      </label>
                      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-body-sm">
                        <span class="material-symbols-outlined text-[18px] text-secondary">chat</span>
                        <input
                          type="text"
                          formControlName="newPhone"
                          placeholder="(00) 00000-0000"
                          class="w-full bg-transparent outline-none text-on-surface font-medium"
                        />
                      </div>
                    </div>

                    <div class="flex flex-col gap-1">
                      <label class="font-label-sm text-[11px] text-on-surface font-semibold">
                        E-mail Principal
                      </label>
                      <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-body-sm">
                        <span class="material-symbols-outlined text-[18px] text-on-surface-variant">mail</span>
                        <input
                          type="email"
                          formControlName="newEmail"
                          placeholder="email@exemplo.com"
                          class="w-full bg-transparent outline-none text-on-surface font-medium"
                        />
                      </div>
                    </div>

                    <div class="sm:col-span-2 flex flex-col gap-1 p-2.5 rounded-lg bg-surface-container border border-surface-container-high">
                      <div class="flex items-center justify-between">
                        <span class="font-label-sm text-[11px] text-primary font-bold flex items-center gap-1">
                          <span class="material-symbols-outlined text-[15px]">emergency</span>
                          Contato de Emergência (Mandatório CFP Res. 11/2018 para Telessaúde)
                        </span>
                        <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                          CFP Compliance
                        </span>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-0.5">
                        <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-[12px]">
                          <span class="material-symbols-outlined text-[16px] text-on-surface-variant">person</span>
                          <input
                            type="text"
                            formControlName="newEmergencyName"
                            placeholder="Nome do contato (ex: Cônjuge)"
                            class="w-full bg-transparent outline-none text-on-surface text-[12px] font-medium"
                          />
                        </div>
                        <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container-lowest border border-outline-variant/60 text-[12px]">
                          <span class="material-symbols-outlined text-[16px] text-on-surface-variant">call</span>
                          <input
                            type="text"
                            formControlName="newEmergencyPhone"
                            placeholder="Telefone de emergência"
                            class="w-full bg-transparent outline-none text-on-surface text-[12px] font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between gap-2 pt-1">
                    <label class="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        formControlName="sendLgpdWhatsapp"
                        class="accent-[#005c55] w-4 h-4 rounded"
                      />
                      <span class="text-[12px] text-on-surface font-medium">
                        Enviar termo TCLE e consentimento LGPD via WhatsApp ao salvar
                      </span>
                    </label>
                  </div>
                </div>
              }

              <!-- MODALIDADE E LOCAL DE ATENDIMENTO -->
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[16px]">video_camera_front</span>
                  <span>Modalidade e Local de Atendimento</span>
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <label
                    [class]="
                      form.controls.modality.value === 'Telessaúde'
                        ? 'relative flex flex-col p-3 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer shadow-sm'
                        : 'relative flex flex-col p-3 rounded-xl border border-outline-variant hover:border-primary/40 bg-surface-bright cursor-pointer transition-colors'
                    "
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary text-[20px]">videocam</span>
                        <span class="font-label-md text-label-md text-on-surface font-bold">Telessaúde</span>
                      </div>
                      <input
                        type="radio"
                        formControlName="modality"
                        value="Telessaúde"
                        class="accent-[#005c55] w-4 h-4"
                      />
                    </div>
                    <span class="font-label-sm text-[11px] text-on-surface-variant mt-1">
                      Link seguro gerado e enviado ao paciente
                    </span>
                  </label>

                  <label
                    [class]="
                      form.controls.modality.value === 'Presencial'
                        ? 'relative flex flex-col p-3 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer shadow-sm'
                        : 'relative flex flex-col p-3 rounded-xl border border-outline-variant hover:border-primary/40 bg-surface-bright cursor-pointer transition-colors'
                    "
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-on-surface-variant text-[20px]">apartment</span>
                        <span class="font-label-md text-label-md text-on-surface font-bold">Presencial</span>
                      </div>
                      <input
                        type="radio"
                        formControlName="modality"
                        value="Presencial"
                        class="accent-[#005c55] w-4 h-4"
                      />
                    </div>
                    <span class="font-label-sm text-[11px] text-on-surface-variant mt-1">
                      Recepção presencial e check-in físico
                    </span>
                  </label>
                </div>
              </div>

              <!-- DATA, HORÁRIO E DURAÇÃO -->
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[16px]">schedule</span>
                  <span>Data, Horário e Duração</span>
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  <div>
                    <span class="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-medium">
                      Data da Consulta
                    </span>
                    <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-label-md text-label-md">
                      <span class="material-symbols-outlined text-[18px] text-primary">calendar_today</span>
                      <input
                        type="date"
                        formControlName="date"
                        class="w-full bg-transparent outline-none font-semibold text-on-surface"
                      />
                    </div>
                  </div>

                  <div>
                    <span class="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-medium">
                      Horário de Início
                    </span>
                    <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-label-md text-label-md">
                      <span class="material-symbols-outlined text-[18px] text-primary">alarm</span>
                      <input
                        type="time"
                        formControlName="startTime"
                        class="w-full bg-transparent outline-none font-bold text-on-surface"
                      />
                    </div>
                  </div>

                  <div>
                    <span class="font-label-sm text-[11px] text-on-surface-variant block mb-1 font-medium">
                      Duração Prevista
                    </span>
                    <div class="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container border border-outline-variant/60 text-on-surface font-label-md text-label-md">
                      <span class="material-symbols-outlined text-[18px] text-primary">timer</span>
                      <select
                        formControlName="durationMinutes"
                        class="w-full bg-transparent outline-none text-on-surface font-medium"
                      >
                        <option [ngValue]="30">30 min</option>
                        <option [ngValue]="50">50 min (até {{ computedEndTime() }})</option>
                        <option [ngValue]="60">60 min</option>
                        <option [ngValue]="90">90 min</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- TIPO DE SESSÃO E ABORDAGEM -->
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[16px]">psychology</span>
                  <span>Tipo de Sessão e Abordagem</span>
                </label>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-surface-bright border border-surface-container gap-2">
                  <div class="flex flex-col">
                    <input
                      type="text"
                      formControlName="sessionType"
                      class="font-label-md text-label-md text-on-surface font-semibold bg-transparent outline-none border-b border-transparent focus:border-primary"
                    />
                    <span class="font-body-sm text-body-sm text-on-surface-variant">
                      Abordagem: {{ approachLabel() }}
                    </span>
                  </div>
                  <label class="inline-flex items-center gap-2 cursor-pointer self-start sm:self-center shrink-0">
                    <input
                      type="checkbox"
                      formControlName="repeatWeekly"
                      class="accent-[#005c55] w-4 h-4 rounded"
                    />
                    <span class="font-label-sm text-label-sm text-on-surface font-medium">
                      Repetir semanalmente
                    </span>
                  </label>
                </div>
              </div>

              <!-- PARÂMETROS FINANCEIROS & SPLIT AUTOMÁTICO -->
              <div class="flex flex-col gap-1.5">
                <label class="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-[16px]">payments</span>
                  <span>Parâmetros Financeiros &amp; Split Automático</span>
                </label>
                <div class="p-3.5 rounded-xl bg-surface-container-low border border-surface-container flex flex-col gap-2.5">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                      <span class="font-label-sm text-label-sm text-on-surface-variant font-medium">
                        Honorário Clínico:
                      </span>
                      <div class="inline-flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/40">
                        <span class="font-label-md text-primary font-bold">R$</span>
                        <input
                          type="number"
                          min="0"
                          step="10"
                          formControlName="honorarioValue"
                          class="w-20 bg-transparent outline-none font-headline-sm text-primary font-bold"
                        />
                      </div>
                    </div>
                    <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-semibold">
                      <span class="material-symbols-outlined text-[14px] text-secondary">call_split</span>
                      <span>
                        Split: {{ splitProfissionalLabel() }} (70% Profissional) | {{ splitClinicaLabel() }} (30% Clínica)
                      </span>
                    </div>
                  </div>
                  <div class="text-body-sm text-[12px] text-on-surface-variant flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-secondary text-[16px]">qr_code_2</span>
                    <span>Cobrança via Pix Automático com emissão de recibo dedutível (Carnê-Leão).</span>
                  </div>
                  <label class="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      formControlName="sendReminder24h"
                      class="accent-[#005c55] w-4 h-4 rounded"
                    />
                    <span class="font-label-sm text-label-sm text-on-surface">
                      Enviar lembrete e link via WhatsApp e E-mail com 24h de antecedência
                    </span>
                  </label>
                </div>
              </div>

              @if (validationError()) {
                <p role="alert" class="text-label-sm text-error font-semibold px-1">
                  {{ validationError() }}
                </p>
              }
            </div>

            <!-- Footer -->
            <div class="p-space-lg border-t border-surface-container bg-surface-bright flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div class="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-[11px]">
                <span class="material-symbols-outlined text-primary text-[16px]">verified</span>
                <span>Em conformidade com a Resolução CFP nº 11/2018 para Telessaúde.</span>
              </div>
              <div class="flex items-center gap-space-sm justify-end">
                <button
                  type="button"
                  (click)="closed.emit()"
                  class="px-space-md py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="submitting()"
                  class="inline-flex items-center gap-space-xs px-space-lg py-2.5 rounded-xl bg-primary text-on-primary hover:bg-primary-container font-label-lg text-label-lg transition-colors shadow-md cursor-pointer disabled:opacity-60"
                >
                  <span class="material-symbols-outlined text-[20px]">check_circle</span>
                  <span>{{ submitting() ? 'Agendando...' : 'Confirmar e Agendar Consulta' }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    }
  `,
})
export class QuickAppointmentModalComponent {
  public readonly isOpen = input.required<boolean>();
  public readonly patients = input.required<readonly PacienteApiDto[]>();
  public readonly approachLabel = input<string>('Terapia Cognitivo-Comportamental (TCC)');
  public readonly submitting = input<boolean>(false);

  public readonly closed = output<void>();
  public readonly submitted = output<QuickAppointmentFormPayload>();

  public readonly defaultAvatar = ClinicalStoreService.DEFAULT_PATIENT_AVATAR;
  public readonly patientMode = signal<'existing' | 'new'>('existing');
  public readonly showPatientDropdown = signal<boolean>(false);
  public readonly validationError = signal<string>('');

  public readonly form = new FormGroup({
    patientId: new FormControl<string>('', { nonNullable: true }),
    newFullName: new FormControl<string>('', { nonNullable: true }),
    newCpf: new FormControl<string>('', { nonNullable: true }),
    newBirthDate: new FormControl<string>('', { nonNullable: true }),
    newPhone: new FormControl<string>('', { nonNullable: true }),
    newEmail: new FormControl<string>('', { nonNullable: true }),
    newEmergencyName: new FormControl<string>('', { nonNullable: true }),
    newEmergencyPhone: new FormControl<string>('', { nonNullable: true }),
    sendLgpdWhatsapp: new FormControl<boolean>(true, { nonNullable: true }),
    modality: new FormControl<'Telessaúde' | 'Presencial'>('Telessaúde', { nonNullable: true }),
    date: new FormControl<string>(this.getTodayIso(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    startTime: new FormControl<string>('16:00', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    durationMinutes: new FormControl<number>(50, { nonNullable: true }),
    sessionType: new FormControl<string>('Sessão Individual Ordinária', { nonNullable: true }),
    repeatWeekly: new FormControl<boolean>(true, { nonNullable: true }),
    honorarioValue: new FormControl<number>(250, { nonNullable: true }),
    sendReminder24h: new FormControl<boolean>(true, { nonNullable: true }),
  });

  public readonly selectedPatient = computed<PacienteApiDto | null>(() => {
    const id = this.form.controls.patientId.value;
    const list = this.patients();
    if (list.length === 0) return null;
    return list.find((p) => p.idPaciente === id) ?? list[0];
  });

  constructor() {
    effect(() => {
      const list = this.patients();
      if (list.length > 0 && !this.form.controls.patientId.value) {
        this.form.controls.patientId.setValue(list[0].idPaciente);
      }
    });
  }

  public switchToNewPatient(): void {
    this.patientMode.set('new');
    this.validationError.set('');
  }

  public switchToExistingPatient(): void {
    this.patientMode.set('existing');
    this.validationError.set('');
  }

  public togglePatientSelector(): void {
    this.showPatientDropdown.update((v) => !v);
  }

  public onPatientDropdownChange(): void {
    this.showPatientDropdown.set(false);
  }

  public computedEndTime(): string {
    const start = this.form.controls.startTime.value || '16:00';
    const dur = Number(this.form.controls.durationMinutes.value || 50);
    const [h, m] = start.split(':').map(Number);
    const d = new Date();
    d.setHours(h || 16, (m || 0) + dur, 0, 0);
    return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  public splitProfissionalLabel(): string {
    const total = Number(this.form.controls.honorarioValue.value || 0);
    return (total * 0.7).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  public splitClinicaLabel(): string {
    const total = Number(this.form.controls.honorarioValue.value || 0);
    return (total * 0.3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  public maskCpf(cpf: string): string {
    if (!cpf || cpf.length < 11) return cpf;
    return `${cpf.slice(0, 3)}.***.***-${cpf.slice(-2)}`;
  }

  public onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }

  public onSubmit(): void {
    this.validationError.set('');
    const v = this.form.getRawValue();

    if (this.patientMode() === 'new') {
      if (!v.newFullName.trim() || !v.newCpf.trim() || !v.newPhone.trim()) {
        this.validationError.set('Preencha Nome Completo, CPF e Telefone/WhatsApp do novo paciente.');
        return;
      }
    } else if (!this.selectedPatient()) {
      this.validationError.set('Selecione um paciente existente ou cadastre um novo paciente.');
      return;
    }

    this.submitted.emit({
      mode: this.patientMode(),
      patientId: this.selectedPatient()?.idPaciente,
      newPatient:
        this.patientMode() === 'new'
          ? {
              fullName: v.newFullName,
              cpf: v.newCpf,
              birthDate: v.newBirthDate,
              phone: v.newPhone,
              email: v.newEmail,
              emergencyContactName: v.newEmergencyName,
              emergencyContactPhone: v.newEmergencyPhone,
              sendLgpdWhatsapp: v.sendLgpdWhatsapp,
            }
          : undefined,
      modality: v.modality,
      date: v.date,
      startTime: v.startTime,
      durationMinutes: Number(v.durationMinutes || 50),
      sessionType: v.sessionType || 'Sessão Individual Ordinária',
      repeatWeekly: v.repeatWeekly,
      honorarioValue: Number(v.honorarioValue || 0),
      sendReminder24h: v.sendReminder24h,
    });
  }

  private getTodayIso(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}
