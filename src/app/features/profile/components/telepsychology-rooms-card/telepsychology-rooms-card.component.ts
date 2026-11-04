import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TelepsychologyRoomConfig } from '../../../../core/models';

@Component({
  selector: 'app-telepsychology-rooms-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rounded-xl bg-surface-container-lowest p-space-xl shadow-sm space-y-space-md">
      <div class="flex items-center justify-between pb-space-xs">
        <div>
          <h3 class="font-headline-sm text-headline-sm text-on-surface">
            Salas Seguras &amp; Telepsicologia
          </h3>
          <p class="font-body-sm text-body-sm text-on-surface-variant">
            Links de atendimento com criptografia ponta a ponta homologados CFP
          </p>
        </div>
        <span class="material-symbols-outlined text-secondary text-[26px]">
          enhanced_encryption
        </span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div class="rounded-lg bg-surface-container-low p-space-md flex flex-col justify-between w-full">
          <span class="font-label-sm text-label-sm uppercase text-on-surface-variant font-medium">
            Link Permanente da Sala
          </span>
          <div class="my-2 truncate font-label-md text-label-md text-primary font-bold">
            {{ config().permanentRoomLink }}
          </div>
          <span class="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary">
            <span class="material-symbols-outlined text-[14px]">lock</span>
            {{ config().sslSpecification }}
          </span>
        </div>

        <div class="rounded-lg bg-surface-container-low p-space-md flex flex-col justify-between w-full">
          <span class="font-label-sm text-label-sm uppercase text-on-surface-variant font-medium">
            Gravação de Sessões
          </span>
          <div class="my-2 font-label-md text-label-md text-on-surface font-semibold">
            {{ config().sessionRecordingPolicy }}
          </div>
          <span class="font-label-sm text-label-sm text-on-surface-variant">
            {{ config().ethicsComplianceNote }}
          </span>
        </div>

        <div class="rounded-lg bg-surface-container-low p-space-md flex flex-col justify-between w-full">
          <span class="font-label-sm text-label-sm uppercase text-on-surface-variant font-medium">
            Consentimento Informado
          </span>
          <div class="my-2 font-label-md text-label-md text-on-surface font-semibold">
            {{ config().informedConsentTitle }}
          </div>
          <span class="font-label-sm text-label-sm text-secondary font-medium">
            {{ config().informedConsentSubtitle }}
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TelepsychologyRoomsCardComponent {
  public readonly config = input.required<TelepsychologyRoomConfig>();
}
