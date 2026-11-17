import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DadosAluno {
  nome: string;
  email: string;
  ra: string;
  telefone: string;
  dataNascimento: string;
  curso: string;
  turma: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  private authService = inject(AuthService);

  editando = false;
  mensagem = '';
  sucesso = false;

  dados: DadosAluno = {
    nome: '',
    email: '',
    ra: '',
    telefone: '',
    dataNascimento: '',
    curso: '',
    turma: ''
  };

  private chavePerfil = '';

  ngOnInit(): void {
    const usuario = this.authService.usuarioAtual();

    if (!usuario) {
      return;
    }

    this.dados.email = usuario.email;
    this.dados.nome = usuario.email.split('@')[0]
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, letra => letra.toUpperCase());

    this.chavePerfil = `perfil-aluno-${usuario.email}`;

    const dadosSalvos = localStorage.getItem(this.chavePerfil);

    if (dadosSalvos) {
      try {
        const perfilSalvo = JSON.parse(dadosSalvos);
        this.dados = {
          ...this.dados,
          ...perfilSalvo,
          email: usuario.email
        };
      } catch {
        console.error('Erro ao carregar os dados do perfil.');
      }
    }
  }

  editar(): void {
    this.editando = true;
    this.mensagem = '';
  }

  cancelar(): void {
    this.ngOnInit();
    this.editando = false;
    this.mensagem = '';
  }

  salvar(): void {
    if (
      !this.dados.nome.trim() ||
      !this.dados.ra.trim() ||
      !this.dados.telefone.trim()
    ) {
      this.sucesso = false;
      this.mensagem = 'Preencha nome, RA e telefone.';
      return;
    }

    localStorage.setItem(
      this.chavePerfil,
      JSON.stringify(this.dados)
    );

    this.editando = false;
    this.sucesso = true;
    this.mensagem = 'Seus dados foram atualizados com sucesso!';
  }
}