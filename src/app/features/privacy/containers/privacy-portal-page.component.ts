import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClinicalStoreService } from '../../../core/services/clinical-store.service';
import { LayoutService } from '../../../core/services/layout.service';
import { PatientTargetSelectorComponent } from '../components/patient-target-selector/patient-target-selector.component';
import { PortabilityExportPanelComponent } from '../components/portability-export-panel/portability-export-panel.component';

@Component({
  selector: 'app-privacy-portal-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PatientTargetSelectorComponent,
    PortabilityExportPanelComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col w-full gap-space-lg">
      <!-- Header Institucional & Indicadores Regulatórios -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
        <div class="flex flex-col gap-space-xs">
          <h1 class="text-headline-lg font-headline-lg text-on-surface tracking-tight">
            Portal de Privacidade, Exportação e Auditoria LGPD
          </h1>
          <p class="text-body-md font-body-md text-on-surface-variant max-w-3xl">
            Gestão em conformidade estrita para requisições de titulares, fiscalizações do Conselho
            Regional de Psicologia e auditorias de encarregados de proteção de dados (DPO).
          </p>
        </div>
      </div>

      <!-- Seleção e Busca Rápida de Paciente -->
      <app-patient-target-selector
        [searchControl]="searchControl"
        [portalState]="store.privacyPortal()"
      />

      <!-- Área de Portabilidade de Dados e Visualização Estrutural -->
      <app-portability-export-panel
        [formats]="store.portabilityFormats()"
        [lastEmissionLabel]="store.privacyPortal().lastPortabilityEmissionLabel"
        [isExporting]="store.privacyPortal().isExporting"
        (exportRequested)="onExportRecords()"
      />
    </div>
  `,
})
export class PrivacyPortalPageComponent {
  public readonly store = inject(ClinicalStoreService);
  private readonly layout = inject(LayoutService);

  public readonly searchControl = new FormControl<string>(
    this.store.privacyPortal().searchQuery,
    { nonNullable: true }
  );

  constructor() {
    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        this.store.updatePrivacySearchQuery(value);
      });
  }

  public onExportRecords(): void {
    if (this.store.privacyPortal().isExporting) {
      return;
    }

    this.store.setPrivacyExporting(true);
    setTimeout(() => {
      this.store.markPortabilityExportCompleted();
      this.layout.showToast(
        'Pacote de Portabilidade Gerado com Sucesso',
        'Arquivo assinado com certificado A3 ICP-Brasil registrado no Log #43.',
        'task_alt',
        5000
      );
    }, 1000);
  }
}
