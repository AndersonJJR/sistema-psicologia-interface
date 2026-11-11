import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { ClinicalStoreService } from './core/services/clinical-store.service';
import { SignInFormComponent } from './features/auth/components/sign-in-form/sign-in-form.component';
import { TopbarComponent } from './shared/components/topbar/topbar.component';

describe('Sistema Psicologia Interface — Integração Front-End & Back-End', () => {
  let httpMock: HttpTestingController;
  let store: ClinicalStoreService;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, SignInFormComponent, TopbarComponent],
      providers: [provideRouter(routes), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(ClinicalStoreService);
    authService = TestBed.inject(AuthService);
    authService.logout();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve instanciar o componente raiz da aplicação', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('deve autenticar via AuthService e armazenar a sessão JWT com RBAC', () => {
    let completed = false;
    authService
      .login({ login: 'usuario@psicosafe.com.br', senha: 'MinhaSenhaSegura' })
      .subscribe((res) => {
        expect(res.token).toBe('jwt-token-mock');
        expect(authService.isAuthenticated()).toBe(true);
        expect(authService.canAccessProntuarios()).toBe(true);
        expect(authService.canAccessRegistrosDocumentais()).toBe(true);
        completed = true;
      });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({
      token: 'jwt-token-mock',
      tipo: 'Bearer',
      idUsuario: '11111111-1111-1111-1111-111111111111',
      login: 'usuario@psicosafe.com.br',
      perfil: 'PSICOLOGO',
      idPsicologoVinculado: '22222222-2222-2222-2222-222222222222',
    });

    expect(completed).toBe(true);
  });

  it('deve iniciar o formulário de login com campos vazios aguardando entrada do usuário', () => {
    const fixture = TestBed.createComponent(SignInFormComponent);
    const comp = fixture.componentInstance;
    expect(comp.form.controls.email.value).toBe('');
    expect(comp.form.controls.password.value).toBe('');
  });

  it('deve gerar data atual dinamicamente para o cabeçalho e semanas da agenda', () => {
    const currentDate = store.currentDateHeaderLabel();
    const currentYear = String(new Date().getFullYear());
    expect(currentDate).toContain(currentYear);
    expect(currentDate).not.toContain('24 de Maio de 2024');

    const weekLabel = ClinicalStoreService.getCurrentWeekRangeLabel(0);
    expect(weekLabel).toContain(currentYear);

    const days = ClinicalStoreService.getCurrentWeekDays(0);
    expect(days.length).toBe(5);
  });

  it('deve abrir e fechar o modal de calendário ao interagir na topbar', () => {
    const fixture = TestBed.createComponent(TopbarComponent);
    fixture.componentRef.setInput('collapsed', false);
    fixture.componentRef.setInput('logoUrl', 'http://logo.png');
    fixture.componentRef.setInput('dateLabel', store.currentDateHeaderLabel());
    fixture.componentRef.setInput('professionalName', 'Dr. Teste');
    fixture.componentRef.setInput('professionalCrp', 'CRP 06/1234');
    fixture.detectChanges();

    const comp = fixture.componentInstance;
    expect(comp.isCalendarOpen()).toBe(false);

    comp.toggleCalendarModal();
    expect(comp.isCalendarOpen()).toBe(true);

    comp.closeCalendarModal();
    expect(comp.isCalendarOpen()).toBe(false);
  });

  it('deve converter datas de nascimento entre formato brasileiro e ISO-8601 para a API', () => {
    const iso = ClinicalStoreService.parseBirthDateToIso('14/05/1992 - 32 anos');
    expect(iso).toBe('1992-05-14');

    const formatted = ClinicalStoreService.formatIsoBirthDate('1992-05-14');
    expect(formatted.formattedLabel).toContain('14/05/1992');
    expect(formatted.ageYears).toBeGreaterThanOrEqual(30);
  });

  it('deve carregar lista de pacientes do back-end e sincronizar o prontuário ativo', () => {
    store.loadPatientsFromBackend();

    const req = httpMock.expectOne(
      'http://localhost:8080/api/v1/pacientes?incluirInativos=true'
    );
    expect(req.request.method).toBe('GET');
    req.flush([
      {
        idPaciente: '33333333-3333-3333-3333-333333333333',
        nome: 'Lucas Gabriel Albuquerque Rocha',
        cpf: '342.189.058-22',
        dataNascimento: '1992-05-14',
        email: 'lucas.albuquerque@email.com',
        telefone: '(11) 97123-4567',
        contatoEmergenciaNome: 'Mariana Albuquerque (Irmã)',
        contatoEmergenciaTelefone: '(11) 99887-6655',
        enderecoLocalSessao: 'Rua das Camélias, 450, São Paulo - SP',
        ativo: true,
        deletedAt: null,
      },
    ]);

    expect(store.patientsList().length).toBe(1);
    expect(store.patientRecord().id).toBe('33333333-3333-3333-3333-333333333333');
    expect(store.patientRecord().fullName).toBe('Lucas Gabriel Albuquerque Rocha');
  });
});
