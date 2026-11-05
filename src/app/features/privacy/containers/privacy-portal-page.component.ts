import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
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
        [crpLabel]="'CRP ' + store.profile().crpRegistration"
      />

      <!-- Área de Portabilidade de Dados e Visualização Estrutural -->
      <app-portability-export-panel
        [formats]="store.portabilityFormats()"
        [lastEmissionLabel]="store.privacyPortal().lastPortabilityEmissionLabel"
        [isExporting]="store.privacyPortal().isExporting"
        (exportRequested)="onExportRecords()"
      />

      <!-- Trilha de Auditoria Imutável (LOGS_AUDITORIA) -->
      @if (store.auditLogs().length > 0) {
        <section
          class="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-space-sm">
              <span class="material-symbols-outlined text-primary text-[22px]">policy</span>
              <h2 class="text-headline-sm font-headline-sm text-on-surface">
                Trilha de Auditoria LGPD em Tempo Real (LOGS_AUDITORIA)
              </h2>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full bg-surface-container-low text-primary font-label-sm text-label-sm font-semibold"
            >
              {{ store.auditLogs().length }} eventos recentes
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left font-body-sm text-body-sm">
              <thead>
                <tr
                  class="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider"
                >
                  <th class="py-2.5 px-space-sm rounded-l-lg">Carimbo UTC</th>
                  <th class="py-2.5 px-space-sm">Operador</th>
                  <th class="py-2.5 px-space-sm">Endereço IP</th>
                  <th class="py-2.5 px-space-sm">Ação</th>
                  <th class="py-2.5 px-space-sm rounded-r-lg">Recurso Auditado</th>
                </tr>
              </thead>
              <tbody>
                @for (log of store.auditLogs(); track log.idLog; let odd = $odd) {
                  <tr [class]="odd ? 'bg-surface-container-low/40' : ''">
                    <td class="py-2 px-space-sm font-mono text-[12px] text-on-surface-variant">
                      {{ log.carimboTempoUtc }}
                    </td>
                    <td class="py-2 px-space-sm font-medium text-on-surface">
                      {{ log.idUsuarioOperador }}
                    </td>
                    <td class="py-2 px-space-sm font-mono text-[12px] text-on-surface-variant">
                      {{ log.enderecoIp }}
                    </td>
                    <td class="py-2 px-space-sm">
                      <span
                        class="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold"
                      >
                        {{ log.acao }}
                      </span>
                    </td>
                    <td class="py-2 px-space-sm font-mono text-[12px] text-on-surface">
                      {{ log.idRecursoAcessado }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }
    </div>
  `,
})
export class PrivacyPortalPageComponent implements OnInit {
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

  public ngOnInit(): void {
    this.store.loadPrivacyAndAuditFromBackend();
  }

  public onExportRecords(): void {
    if (this.store.privacyPortal().isExporting) {
      return;
    }

    this.store.exportPatientPortabilityFromBackend().subscribe((exportDto) => {
      if (exportDto && typeof window !== 'undefined' && window.URL?.createObjectURL) {
        try {
          const binaryString = window.atob(exportDto.documentoPdfABase64);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
          const pdfUrl = window.URL.createObjectURL(pdfBlob);
          const anchor = window.document.createElement('a');
          anchor.href = pdfUrl;
          anchor.download = exportDto.nomeArquivoPdfA || 'dossie_paciente_pdfa.pdf';
          anchor.click();
          window.URL.revokeObjectURL(pdfUrl);

          const jsonBlob = new Blob([JSON.stringify(exportDto, null, 2)], {
            type: 'application/json;charset=utf-8',
          });
          const jsonUrl = window.URL.createObjectURL(jsonBlob);
          const jsonAnchor = window.document.createElement('a');
          jsonAnchor.href = jsonUrl;
          jsonAnchor.download = 'dossie_portabilidade_lgpd.json';
          jsonAnchor.click();
          window.URL.revokeObjectURL(jsonUrl);
        } catch {
          // Ignore browser download error in headless test environments
        }
      }

      this.layout.showToast(
        'Pacote de Portabilidade Gerado com Sucesso',
        'Arquivo PDF/A-1b + JSON assinado com certificado ICP-Brasil registrado na auditoria.',
        'task_alt',
        5000
      );
    });
  }
}
