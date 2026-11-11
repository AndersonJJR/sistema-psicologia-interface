import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  CalendarDayColumn,
  CalendarMonthCell,
  CalendarViewMode,
  ScheduleSlotItem,
} from '../../../../core/models';

@Component({
  selector: 'app-timetable-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-space-lg w-full">
      <div
        class="w-full flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden"
      >
        <!-- ========================================== -->
        <!-- 1. MODO DIÁRIO: GRADE COMPLETA DO DIA     -->
        <!-- ========================================== -->
        @if (viewMode() === 'diario') {
          <!-- Daily Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-4 bg-surface-container-low border-b border-surface-container"
          >
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-xs"
              >
                <span class="material-symbols-outlined text-[24px]">calendar_today</span>
              </div>
              <div>
                <h2 class="font-headline-sm text-base font-bold text-on-surface">
                  {{ formatDailyHeader(selectedDate()) }}
                </h2>
                <p class="font-body-sm text-xs text-on-surface-variant">
                  Grade de Atendimentos Clínicos &amp; Telepsicologia CFP
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full bg-surface-container-lowest text-primary font-semibold text-xs shadow-xs"
              >
                {{ getDailySlots(selectedDate()).length }} sessões programadas
              </span>
            </div>
          </div>

          <!-- Daily Hourly Timeline -->
          <div class="flex flex-col divide-y divide-surface-container-high/40">
            @for (hour of hours(); track hour) {
              @if (hour === '12:00 - 14:00') {
                <div
                  class="py-3 px-4 bg-surface-container-low/70 flex items-center justify-center gap-2 text-on-surface-variant font-label-sm text-xs italic"
                >
                  <span class="material-symbols-outlined text-[16px]">restaurant</span>
                  <span>Intervalo Almoço &amp; Análise de Supervisão Ética CFP</span>
                </div>
              } @else {
                <div
                  class="flex flex-col sm:flex-row items-stretch min-h-[76px] hover:bg-surface-container-low/20 transition-colors"
                >
                  <!-- Coluna da Hora -->
                  <div
                    class="w-full sm:w-36 p-3 flex sm:flex-col items-center justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-surface-container-high/40 bg-surface-container-lowest text-center shrink-0"
                  >
                    <span class="font-label-md text-sm font-bold text-on-surface">{{ hour }}</span>
                    <span class="text-[11px] text-on-surface-variant">50 min</span>
                  </div>

                  <!-- Conteúdo do Horário -->
                  <div class="flex-1 p-3 flex items-center">
                    @if (getSlotForDaily(hour, selectedDate()); as slot) {
                      <div
                        (click)="slotSelected.emit(slot)"
                        class="w-full rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs cursor-pointer hover:shadow-md transition-all border"
                        [class]="
                          slot.variant.includes('telehealth')
                            ? 'bg-primary-container/10 border-primary/20 hover:border-primary'
                            : slot.variant === 'completed-supervision'
                              ? 'bg-surface-container border-outline-variant/30'
                              : 'bg-surface-container-low border-surface-container hover:border-secondary'
                        "
                      >
                        <div class="flex items-center gap-3">
                          <div
                            class="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                            [class]="
                              slot.variant.includes('telehealth')
                                ? 'bg-primary text-on-primary'
                                : 'bg-secondary text-on-secondary'
                            "
                          >
                            <span class="material-symbols-outlined text-[20px]">
                              {{ slot.variant.includes('telehealth') ? 'videocam' : 'apartment' }}
                            </span>
                          </div>
                          <div>
                            <div class="flex items-center gap-2 flex-wrap">
                              <h3 class="font-headline-sm text-sm font-bold text-on-surface">
                                {{ slot.patientName }}
                              </h3>
                              <span
                                class="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                [class]="
                                  slot.variant.includes('telehealth')
                                    ? 'bg-primary/10 text-primary'
                                    : 'bg-secondary/10 text-secondary'
                                "
                              >
                                {{
                                  slot.variant.includes('telehealth') ? 'Telessaúde' : 'Presencial'
                                }}
                              </span>
                            </div>
                            <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">
                              {{ slot.subtitle }}
                              @if (slot.timeRange) {
                                • {{ slot.timeRange }}
                              }
                            </p>
                          </div>
                        </div>

                        <div class="flex items-center gap-2 self-end md:self-center">
                          @if (slot.statusLabel) {
                            <span
                              class="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary/15 text-secondary"
                            >
                              {{ slot.statusLabel }}
                            </span>
                          }
                          <button
                            type="button"
                            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-semibold shadow-xs cursor-pointer"
                          >
                            <span class="material-symbols-outlined text-[15px]">clinical_notes</span>
                            <span>Prontuário</span>
                          </button>
                        </div>
                      </div>
                    } @else {
                      <div
                        class="w-full py-2 px-3 rounded-lg border border-dashed border-outline-variant/40 flex items-center justify-between text-on-surface-variant hover:border-primary/40 transition-colors"
                      >
                        <span class="text-xs font-medium">Horário Disponível para Atendimento</span>
                        <button
                          type="button"
                          (click)="
                            newSlotRequested.emit({
                              hourSlot: hour,
                              dayIndex: getDayIndex(selectedDate()),
                              date: selectedDate(),
                            })
                          "
                          class="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline cursor-pointer"
                        >
                          <span class="material-symbols-outlined text-[16px]">add_circle</span>
                          <span>Reservar Horário</span>
                        </button>
                      </div>
                    }
                  </div>
                </div>
              }
            }
          </div>

          <!-- ========================================== -->
          <!-- 2. MODO MENSAL: CALENDÁRIO RESUMIDO        -->
          <!-- ========================================== -->
        } @else if (viewMode() === 'mensal') {
          <!-- Monthly Weekday Column Headers -->
          <div
            class="grid grid-cols-7 bg-surface-container-low text-on-surface py-2.5 px-2 text-center font-label-sm text-xs font-semibold uppercase tracking-wider"
          >
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          <!-- Monthly Calendar Grid (Resumido) -->
          <div class="grid grid-cols-7 gap-1.5 p-2 bg-surface-container-low/20">
            @for (cell of monthlyGrid(); track cell.dateString) {
              <div
                (click)="onSelectMonthCell(cell)"
                class="min-h-[105px] rounded-xl p-2 flex flex-col justify-between border transition-all cursor-pointer select-none"
                [class]="
                  cell.isCurrentMonth
                    ? cell.isSelected
                      ? 'bg-surface-container-lowest border-primary shadow-md ring-2 ring-primary/30'
                      : 'bg-surface-container-lowest border-outline-variant/20 hover:border-primary/50 hover:shadow-sm'
                    : 'bg-surface-container-low/40 border-transparent opacity-40 hover:opacity-75'
                "
                [class.ring-2]="cell.isToday && !cell.isSelected"
                [class.ring-primary]="cell.isToday && !cell.isSelected"
              >
                <!-- Cell Header -->
                <div class="flex items-center justify-between">
                  <span
                    class="font-label-md text-xs font-bold"
                    [class]="cell.isToday ? 'text-primary' : 'text-on-surface'"
                  >
                    {{ cell.dayNumber }}
                  </span>
                  @if (cell.isToday) {
                    <span
                      class="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 rounded-full bg-primary text-on-primary"
                    >
                      Hoje
                    </span>
                  } @else if (cell.sessionsCount > 0) {
                    <span
                      class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-secondary/15 text-secondary"
                    >
                      {{ cell.sessionsCount }}
                    </span>
                  }
                </div>

                <!-- Cell Body (Resumo de Consultas) -->
                <div class="flex flex-col gap-1 my-1 overflow-hidden">
                  @for (slot of cell.summarySlots.slice(0, 2); track slot.id) {
                    <div
                      class="flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate"
                      [class]="
                        slot.variant.includes('telehealth')
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary/10 text-secondary'
                      "
                      title="{{ slot.hourSlot }} - {{ slot.patientName }} ({{ slot.subtitle }})"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full shrink-0"
                        [class]="
                          slot.variant.includes('telehealth') ? 'bg-primary' : 'bg-secondary'
                        "
                      ></span>
                      <span class="truncate">{{ slot.hourSlot }} {{ slot.patientName }}</span>
                    </div>
                  }
                  @if (cell.sessionsCount > 2) {
                    <span class="text-[9px] text-on-surface-variant font-semibold pl-1">
                      +{{ cell.sessionsCount - 2 }} mais...
                    </span>
                  }
                </div>

                <!-- Cell Footer Hint -->
                <div class="text-[9px] text-on-surface-variant/70 text-right">
                  @if (cell.sessionsCount > 0) {
                    <span>ver dia &rarr;</span>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Bottom Summary Ribbon for Month -->
          <div
            class="px-4 py-2.5 bg-surface-container-low border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant"
          >
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-primary">info</span>
              <span>Visão mensal resumida. Clique em qualquer dia para abrir o detalhamento.</span>
            </div>
            <span class="font-semibold text-primary">
              {{ getTotalMonthlySlots() }} Sessões Registradas no Mês
            </span>
          </div>

          <!-- ========================================== -->
          <!-- 3. MODO SEMANAL: GRADE HORÁRIA PADRÃO (5D) -->
          <!-- ========================================== -->
        } @else {
          <!-- Calendar Column Header (Days) -->
          <div class="grid grid-cols-6 bg-surface-container-low text-on-surface py-3 px-2">
            <div
              class="text-center font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider flex items-center justify-center"
            >
              Horário
            </div>
            @for (day of days(); track day.index) {
              @if (day.isToday) {
                <div
                  class="text-center flex flex-col bg-surface-container-lowest rounded-lg py-1 shadow-sm"
                >
                  <span class="font-label-sm text-label-sm text-primary uppercase font-bold">
                    {{ day.shortDayLabel }}
                  </span>
                  <span class="font-label-md text-label-md text-primary font-extrabold">
                    {{ day.dateNumberLabel }}
                  </span>
                </div>
              } @else {
                <div class="text-center flex flex-col">
                  <span
                    class="font-label-sm text-label-sm text-on-surface-variant uppercase font-medium"
                  >
                    {{ day.shortDayLabel }}
                  </span>
                  <span class="font-label-md text-label-md text-on-surface font-bold">
                    {{ day.dateNumberLabel }}
                  </span>
                </div>
              }
            }
          </div>

          <!-- Timetable Body -->
          <div
            class="flex flex-col relative divide-y divide-surface-container-high/40 text-on-surface"
          >
            @for (hour of hours(); track hour) {
              @if (hour === '12:00 - 14:00') {
                <div class="grid grid-cols-6 py-2 bg-surface-container-low items-center text-center">
                  <div class="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                    12:00 - 14:00
                  </div>
                  <div
                    class="col-span-5 text-on-surface-variant font-label-sm text-label-sm italic tracking-wide"
                  >
                    Intervalo Almoço &amp; Análise de Supervisão Ética CFP
                  </div>
                </div>
              } @else {
                <div [class]="rowClasses(hour)">
                  <div
                    class="p-2 font-label-sm text-label-sm text-on-surface-variant font-semibold text-center flex items-center justify-center bg-surface-container-lowest"
                  >
                    {{ hour }}
                  </div>

                  @for (day of days(); track day.index) {
                    @if (getSlot(hour, day.index); as slot) {
                      @switch (slot.variant) {
                        @case ('completed-supervision') {
                          <div class="p-1.5">
                            <div
                              (click)="slotSelected.emit(slot)"
                              class="h-full bg-surface-container-high/60 rounded-lg p-2 flex flex-col justify-between hover:bg-surface-container-high transition cursor-pointer"
                            >
                              <span class="font-label-sm text-label-sm text-on-surface-variant">
                                {{ slot.timeRange }}
                              </span>
                              <span
                                class="font-label-md text-label-md font-semibold truncate text-on-surface"
                              >
                                {{ slot.patientName }}
                              </span>
                              <span
                                class="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary"
                              >
                                <span class="material-symbols-outlined text-[12px]">done_all</span>
                                {{ slot.subtitle }}
                              </span>
                            </div>
                          </div>
                        }

                        @case ('presential-today-highlight') {
                          <div class="p-1.5 bg-primary-fixed/20 rounded-lg m-1">
                            <div
                              (click)="slotSelected.emit(slot)"
                              class="h-full bg-surface-container-lowest p-2 rounded-md shadow-sm flex flex-col justify-between cursor-pointer"
                            >
                              <span class="font-label-sm text-label-sm text-primary font-semibold">
                                {{ slot.timeRange }}
                              </span>
                              <span
                                class="font-label-md text-label-md font-bold truncate text-on-surface"
                              >
                                {{ slot.patientName }}
                              </span>
                              <span
                                class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"
                              >
                                <span class="material-symbols-outlined text-[14px]">apartment</span>
                                {{ slot.subtitle }}
                              </span>
                            </div>
                          </div>
                        }

                        @case ('telehealth-standard') {
                          <div class="p-1.5">
                            <div
                              (click)="slotSelected.emit(slot)"
                              class="h-full bg-surface-container-low rounded-lg p-2 flex flex-col justify-between border-l-4 border-primary hover:bg-surface-container transition cursor-pointer"
                            >
                              <span class="font-label-sm text-label-sm text-primary font-medium">
                                {{ slot.timeRange }}
                              </span>
                              <span
                                class="font-label-md text-label-md font-semibold truncate text-on-surface"
                              >
                                {{ slot.patientName }}
                              </span>
                              <span
                                class="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"
                              >
                                <span class="material-symbols-outlined text-[14px]">videocam</span>
                                {{ slot.subtitle }}
                              </span>
                            </div>
                          </div>
                        }

                        @case ('active-selected-telehealth') {
                          <div class="p-1.5">
                            <div
                              (click)="slotSelected.emit(slot)"
                              class="h-full bg-primary-container text-on-primary-container rounded-lg p-2 flex flex-col justify-between shadow-md cursor-pointer hover:opacity-95 transition"
                            >
                              <div class="flex items-center justify-between">
                                <span class="font-label-sm text-label-sm font-bold tracking-wide">
                                  {{ slot.timeRange }}
                                </span>
                                <span class="flex h-2 w-2 rounded-full bg-primary"></span>
                              </div>
                              <span class="font-label-md text-label-md font-extrabold truncate">
                                {{ slot.patientName }}
                              </span>
                              <div class="flex items-center justify-between">
                                <span class="font-label-sm text-label-sm truncate">
                                  {{ slot.subtitle }}
                                </span>
                                @if (slot.statusLabel) {
                                  <span
                                    class="text-[10px] uppercase font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded"
                                  >
                                    {{ slot.statusLabel }}
                                  </span>
                                }
                              </div>
                            </div>
                          </div>
                        }

                        @case ('presential-muted') {
                          <div class="p-1.5">
                            <div
                              (click)="slotSelected.emit(slot)"
                              class="h-full bg-surface-container-low/50 rounded-lg p-2 flex flex-col justify-between hover:bg-surface-container-low transition cursor-pointer"
                            >
                              <span class="font-label-sm text-label-sm text-on-surface-variant">
                                {{ slot.timeRange }}
                              </span>
                              <span
                                class="font-label-md text-label-md font-medium truncate text-on-surface"
                              >
                                {{ slot.patientName }}
                              </span>
                              <span class="font-label-sm text-label-sm text-on-surface-variant">
                                {{ slot.subtitle }}
                              </span>
                            </div>
                          </div>
                        }

                        @default {
                          <div class="p-1.5">
                            <div
                              (click)="slotSelected.emit(slot)"
                              class="h-full bg-surface-container-low rounded-lg p-2 flex flex-col justify-between cursor-pointer"
                            >
                              <span class="font-label-sm text-label-sm text-on-surface-variant">
                                {{ slot.timeRange }}
                              </span>
                              <span class="font-label-md text-label-md font-medium truncate">
                                {{ slot.patientName }}
                              </span>
                              <span class="font-label-sm text-label-sm text-on-surface-variant">
                                {{ slot.subtitle }}
                              </span>
                            </div>
                          </div>
                        }
                      }
                    } @else {
                      <div class="p-2 border-r border-surface-container-high/40 last:border-r-0"></div>
                    }
                  }
                </div>
              }
            }
          </div>
        }

        <!-- Bottom Legend & Timezone -->
        <div
          class="px-space-md py-3 bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm border-t border-surface-container"
        >
          <div class="flex items-center gap-space-md flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <span>Online (Telessaúde)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-secondary"></span>
              <span>Presencial</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-amber-400"></span>
              <span>Recepção / Em Espera</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-slate-400"></span>
              <span>Realizado</span>
            </div>
          </div>
          <div class="flex items-center gap-1 text-primary font-medium">
            <span class="material-symbols-outlined text-[16px]">lock</span>
            <span>Fuso Horário: Brasília (GMT-3)</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TimetableGridComponent {
  public readonly days = input.required<readonly CalendarDayColumn[]>();
  public readonly hours = input.required<readonly string[]>();
  public readonly slots = input.required<readonly ScheduleSlotItem[]>();
  public readonly viewMode = input<CalendarViewMode>('semanal');
  public readonly selectedDate = input<Date>(new Date());
  public readonly monthlyGrid = input<readonly CalendarMonthCell[]>([]);

  public readonly slotSelected = output<ScheduleSlotItem>();
  public readonly newSlotRequested = output<{
    hourSlot: string;
    dayIndex: number;
    date?: Date;
  }>();
  public readonly daySelectedFromMonth = output<Date>();

  public rowClasses(hour: string): string {
    if (hour === '09:00') {
      return 'grid grid-cols-6 min-h-[88px] items-stretch bg-surface-container-low/30';
    }
    if (hour === '14:00') {
      return 'grid grid-cols-6 min-h-[76px] items-stretch';
    }
    return 'grid grid-cols-6 min-h-[72px] items-stretch';
  }

  public getSlot(hour: string, dayIndex: number): ScheduleSlotItem | undefined {
    return this.slots().find((item) => item.hourSlot === hour && item.dayIndex === dayIndex);
  }

  public formatDailyHeader(date: Date): string {
    const days = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`;
  }

  public getDailySlots(date: Date): ScheduleSlotItem[] {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayOfWeek = date.getDay();
    const weekdayIndex = dayOfWeek >= 1 && dayOfWeek <= 5 ? dayOfWeek - 1 : -1;

    return this.slots().filter((s) => {
      if (s.sessionDate) {
        return s.sessionDate === dateStr;
      }
      return weekdayIndex >= 0 && s.dayIndex === weekdayIndex;
    });
  }

  public getSlotForDaily(hour: string, date: Date): ScheduleSlotItem | undefined {
    const daily = this.getDailySlots(date);
    return daily.find((s) => s.hourSlot === hour);
  }

  public getDayIndex(date: Date): number {
    const day = date.getDay();
    return day >= 1 && day <= 5 ? day - 1 : 0;
  }

  public onSelectMonthCell(cell: CalendarMonthCell): void {
    this.daySelectedFromMonth.emit(cell.date);
  }

  public getTotalMonthlySlots(): number {
    return this.monthlyGrid().reduce((acc, c) => acc + (c.isCurrentMonth ? c.sessionsCount : 0), 0);
  }
}
