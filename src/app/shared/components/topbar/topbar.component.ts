import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header [class]="headerClasses()">
      <div class="flex items-center gap-space-md">
        <img
          alt="Logo PsicoSafe"
          class="h-8 w-auto object-contain"
          [src]="logoUrl()"
        />
        <button
          type="button"
          (click)="toggleCalendarModal()"
          class="inline-flex items-center gap-space-xs text-on-surface-variant hover:text-primary font-body-sm text-body-sm px-2.5 py-1.5 rounded-lg hover:bg-surface-container/60 transition-colors cursor-pointer group"
          title="Clique para abrir o calendário da agenda"
        >
          <span class="material-symbols-outlined text-[18px] text-primary group-hover:scale-110 transition-transform">
            calendar_today
          </span>
          <span class="font-medium">{{ dateLabel() }}</span>
        </button>
      </div>

      <div class="flex items-center gap-space-md">
        <a
          routerLink="/login"
          title="Alternar Conta / Sair para Autenticação"
          class="flex items-center gap-space-sm pl-space-sm hover:opacity-90 transition-opacity"
        >
          <div class="text-right hidden sm:flex flex-col">
            <span class="font-label-lg text-label-lg text-on-surface font-semibold">
              {{ professionalName() }}
            </span>
            <span class="font-label-sm text-label-sm text-primary font-medium">
              {{ professionalCrp() }}
            </span>
          </div>
          <div
            class="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-sm"
          >
            <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </a>
      </div>
    </header>

    @if (isCalendarOpen()) {
      <div
        class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150"
        (click)="closeCalendarModal()"
      >
        <div
          class="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden p-5"
          (click)="$event.stopPropagation()"
        >
          <!-- Header do Modal -->
          <div class="flex items-center justify-between pb-3 border-b border-surface-container">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
              <h3 class="font-headline-sm text-sm font-bold text-on-surface">Agenda &amp; Calendário</h3>
            </div>
            <button
              type="button"
              (click)="closeCalendarModal()"
              class="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
              title="Fechar"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <!-- Mês / Ano e Navegação -->
          <div class="flex items-center justify-between py-3">
            <button
              type="button"
              (click)="prevMonth()"
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              title="Mês Anterior"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="font-label-lg text-sm font-semibold text-on-surface capitalize">
                {{ monthYearLabel() }}
              </span>
              <button
                type="button"
                (click)="goToToday()"
                class="px-2 py-0.5 rounded text-[11px] font-semibold bg-secondary-container/40 text-secondary hover:bg-secondary-container/70 transition-colors cursor-pointer"
              >
                Hoje
              </button>
            </div>
            <button
              type="button"
              (click)="nextMonth()"
              class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              title="Próximo Mês"
            >
              <span class="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

          <!-- Dias da Semana -->
          <div class="grid grid-cols-7 gap-1 text-center font-label-sm text-[11px] font-bold text-on-surface-variant pb-1">
            @for (w of weekDaysLabels; track w) {
              <div>{{ w }}</div>
            }
          </div>

          <!-- Grid de Dias -->
          <div class="grid grid-cols-7 gap-1 text-center">
            @for (blank of blankDaysLeading(); track $index) {
              <div class="h-8"></div>
            }
            @for (day of daysInMonth(); track day.dayNumber) {
              <button
                type="button"
                (click)="selectDay(day.dayNumber)"
                class="h-8 w-8 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all cursor-pointer"
                [class.bg-primary]="day.isSelected"
                [class.text-on-primary]="day.isSelected"
                [class.font-bold]="day.isSelected || day.isToday"
                [class.ring-2]="day.isToday && !day.isSelected"
                [class.ring-primary]="day.isToday && !day.isSelected"
                [class.text-primary]="day.isToday && !day.isSelected"
                [class.hover:bg-surface-container]="!day.isSelected"
              >
                {{ day.dayNumber }}
              </button>
            }
          </div>

          <!-- Rodapé do Modal -->
          <div class="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
            <span class="text-on-surface-variant font-medium truncate max-w-[170px]">
              {{ selectedDateLabel() }}
            </span>
            <div class="flex items-center gap-2">
              <a
                routerLink="/agenda"
                (click)="closeCalendarModal()"
                class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-semibold text-xs shadow-sm hover:opacity-95 transition-opacity"
              >
                <span class="material-symbols-outlined text-[14px]">event_note</span>
                Abrir Agenda
              </a>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class TopbarComponent {
  public readonly collapsed = input.required<boolean>();
  public readonly compact16 = input<boolean>(false);
  public readonly hideTopbarLogo = input<boolean>(false);
  public readonly logoUrl = input.required<string>();
  public readonly dateLabel = input.required<string>();
  public readonly professionalName = input.required<string>();
  public readonly professionalCrp = input.required<string>();

  public readonly weekDaysLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  public readonly isCalendarOpen = signal<boolean>(false);
  public readonly viewDate = signal<Date>(new Date());
  public readonly selectedDate = signal<Date>(new Date());

  public readonly monthYearLabel = computed<string>(() => {
    const d = this.viewDate();
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
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  });

  public readonly blankDaysLeading = computed<number[]>(() => {
    const d = this.viewDate();
    const firstDayIndex = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
    return Array.from({ length: firstDayIndex }, (_, i) => i);
  });

  public readonly daysInMonth = computed<
    Array<{ dayNumber: number; isToday: boolean; isSelected: boolean }>
  >(() => {
    const d = this.viewDate();
    const year = d.getFullYear();
    const month = d.getMonth();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const now = new Date();
    const selected = this.selectedDate();

    return Array.from({ length: totalDays }, (_, i) => {
      const dayNumber = i + 1;
      const isToday =
        now.getDate() === dayNumber &&
        now.getMonth() === month &&
        now.getFullYear() === year;
      const isSelected =
        selected.getDate() === dayNumber &&
        selected.getMonth() === month &&
        selected.getFullYear() === year;
      return { dayNumber, isToday, isSelected };
    });
  });

  public readonly selectedDateLabel = computed<string>(() => {
    const sel = this.selectedDate();
    return sel.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  });

  public readonly headerClasses = computed<string>(() => {
    const base =
      'fixed top-0 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter transition-all duration-300';
    if (!this.collapsed()) {
      return `${base} left-72`;
    }
    if (this.compact16()) {
      return `${base} left-16`;
    }
    return `${base} left-20`;
  });

  @HostListener('document:keydown.escape')
  public onEscape(): void {
    if (this.isCalendarOpen()) {
      this.closeCalendarModal();
    }
  }

  public toggleCalendarModal(): void {
    this.isCalendarOpen.update((v) => !v);
  }

  public closeCalendarModal(): void {
    this.isCalendarOpen.set(false);
  }

  public prevMonth(): void {
    this.viewDate.update((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  }

  public nextMonth(): void {
    this.viewDate.update((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  }

  public goToToday(): void {
    const today = new Date();
    this.viewDate.set(new Date(today.getFullYear(), today.getMonth(), 1));
    this.selectedDate.set(today);
  }

  public selectDay(dayNumber: number): void {
    const current = this.viewDate();
    this.selectedDate.set(new Date(current.getFullYear(), current.getMonth(), dayNumber));
  }
}
