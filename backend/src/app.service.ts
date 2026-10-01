import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getDashboard(){
    return{
      pendentes: 12,
      aprovados: 8,
      recusados: 3,
      ultimasSolicitados: [
        {
          tipo: 'Atestado Médico',
          data: '29/07/2026',
          status: 'Pendente',
        },
        {
          tipo: 'Consulta Médica',
          data: '02/06/2026',
          status: 'Aprovado',
        },
        {
          tipo: 'Compromisso Familiar',
          data: '25/05/2026',
          status: 'Reprovado',
        },
      ],
    };
  }
}
