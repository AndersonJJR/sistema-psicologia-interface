import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CalendarDayColumn, ScheduleSlotItem } from '../../../../core/models';

@Component({
  selector: 'app-timetable-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-space-lg w-full">
      <div class="w-full flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
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
        <div class="flex flex-col relative divide-y divide-surface-container-high/40 text-on-surface">
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
                            <span class="font-label-sm text-label-sm text-on-surface-variant">
                              {{ slot.subtitle }}
                            </span>
                          </div>
                        </div>
                      }

                      @case ('telehealth-standard') {
                        <div class="p-1.5">
                          <div
                            (click)="slotSelected.emit(slot)"
                            class="h-full bg-surface-container-lowest p-2 rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-container-low/50 transition cursor-pointer"
                          >
                            <span
                              class="font-label-sm text-label-sm text-on-surface-variant font-medium"
                            >
                              {{ slot.timeRange }}
                            </span>
                            <span
                              class="font-label-md text-label-md font-semibold truncate text-on-surface"
                            >
                              {{ slot.patientName }}
                            </span>
                            <span class="font-label-sm text-label-sm text-primary">
                              {{ slot.subtitle }}
                            </span>
                          </div>
                        </div>
                      }

                      @case ('active-selected-telehealth') {
                        <div class="p-1 bg-primary/10 rounded-lg">
                          <div
                            (click)="slotSelected.emit(slot)"
                            class="h-full bg-primary text-on-primary p-2.5 rounded-lg shadow-md flex flex-col justify-between ring-2 ring-primary ring-offset-2 cursor-pointer"
                          >
                            <div class="flex items-center justify-between">
                              <span
                                class="font-label-sm text-label-sm bg-on-primary/20 px-1.5 py-0.5 rounded text-on-primary font-semibold"
                              >
                                {{ slot.timeRange }}
                              </span>
                              <span
                                class="material-symbols-outlined text-[16px] text-secondary-container"
                              >
                                videocam
                              </span>
                            </div>
                            <div class="flex flex-col mt-1">
                              <span class="font-label-md text-label-md font-bold truncate">
                                {{ slot.patientName }}
                              </span>
                              <span
                                class="font-label-sm text-label-sm text-on-primary-container truncate"
                              >
                                {{ slot.subtitle }}
                              </span>
                            </div>
                            <div
                              class="mt-1 flex items-center gap-1 text-[11px] font-medium text-secondary-container"
                            >
                              <span
                                class="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping"
                              ></span>
                              <span>{{ slot.statusLabel }}</span>
                            </div>
                          </div>
                        </div>
                      }

                      @case ('presential-muted') {
                        <div class="p-1.5">
                          <div
                            (click)="slotSelected.emit(slot)"
                            [class]="
                              day.index === 4 && hour === '09:00'
                                ? 'h-full bg-surface-container-high/60 rounded-lg p-2 flex flex-col justify-between cursor-pointer'
                                : 'h-full bg-surface-container-lowest p-2 rounded-lg shadow-sm flex flex-col justify-between cursor-pointer'
                            "
                          >
                            <span class="font-label-sm text-label-sm text-on-surface-variant">
                              {{ slot.timeRange }}
                            </span>
                            <span
                              class="font-label-md text-label-md font-semibold truncate text-on-surface"
                            >
                              {{ slot.patientName }}
                            </span>
                            <span class="font-label-sm text-label-sm text-secondary">
                              {{ slot.subtitle }}
                            </span>
                          </div>
                        </div>
                      }

                      @case ('interval-prontuario') {
                        <div class="p-1.5 flex items-center justify-center">
                          <span
                            class="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm tracking-tight"
                          >
                            {{ slot.patientName }}
                          </span>
                        </div>
                      }

                      @case ('presential-room2') {
                        <div class="p-1.5">
                          <div
                            (click)="slotSelected.emit(slot)"
                            class="h-full bg-surface-variant/70 text-on-surface p-2 rounded-lg shadow-sm flex flex-col justify-between hover:bg-surface-variant transition cursor-pointer"
                          >
                            <div class="flex items-center justify-between">
                              <span class="font-label-sm text-label-sm text-primary font-bold">
                                {{ slot.timeRange }}
                              </span>
                              <span class="material-symbols-outlined text-[15px] text-primary">
                                apartment
                              </span>
                            </div>
                            <span class="font-label-md text-label-md font-bold truncate">
                              {{ slot.patientName }}
                            </span>
                            <span class="font-label-sm text-label-sm text-on-surface-variant">
                              {{ slot.subtitle }}
                            </span>
                          </div>
                        </div>
                      }

                      @case ('waiting-reception') {
                        <div class="p-1.5">
                          <div
                            (click)="slotSelected.emit(slot)"
                            class="h-full bg-amber-50 rounded-lg p-2 shadow-sm flex flex-col justify-between border-l-4 border-amber-500 cursor-pointer"
                          >
                            <div class="flex items-center justify-between">
                              <span class="font-label-sm text-label-sm font-bold text-amber-900">
                                {{ slot.timeRange }}
                              </span>
                              <span class="material-symbols-outlined text-[16px] text-amber-700">
                                timer
                              </span>
                            </div>
                            <span class="font-label-md text-label-md font-bold text-amber-950 truncate">
                              {{ slot.patientName }}
                            </span>
                            <span
                              class="inline-flex items-center gap-1 font-label-sm text-label-sm text-amber-800 font-medium"
                            >
                              <span
                                class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"
                              ></span>
                              {{ slot.subtitle }}
                            </span>
                          </div>
                        </div>
                      }

                      @case ('day-closing') {
                        <div class="p-1.5">
                          <div
                            class="h-full bg-surface-container-high/40 rounded-lg p-2 flex flex-col justify-center items-center text-center"
                          >
                            <span class="font-label-sm text-label-sm text-on-surface-variant">
                              {{ slot.patientName }}
                            </span>
                          </div>
                        </div>
                      }
                    }
                  } @else {
                    <div
                      class="p-1.5 hover:bg-surface-container-low/40 transition-colors"
                    ></div>
                  }
                }
              </div>
            }
          }
        </div>

        <!-- Calendar Legend Footer -->
        <div
          class="px-space-md py-3 bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm text-on-surface-variant font-label-sm text-label-sm"
        >
          <div class="flex items-center gap-space-md flex-wrap">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <span>Online (Telessaúde)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-surface-variant"></span>
              <span>Presencial</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-amber-400"></span>
              <span>Recepção / Em Espera</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-secondary"></span>
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
  public readonly slotSelected = output<ScheduleSlotItem>();

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
}
