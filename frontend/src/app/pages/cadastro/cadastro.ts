import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

export interface UsuarioServidor {
  nome: string;
  email: string;
  tipo: 'professor' | 'secretaria';
  disciplina?: string;
  senha: string;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {

  nome = '';
  email = '';
  tipo: 'professor' | 'secretaria' = 'professor';
  disciplina = '';
  senha = '';
  confirmarSenha = '';

  mostrarSenha = false;
  mensagem = '';
  sucesso = false;

  constructor(private router: Router) {}

  // ==========================================
  // REALIZAR CADASTRO
  // ==========================================
  cadastrar(): void {
    this.mensagem = '';
    this.sucesso = false;

    // Validação de e-mail básico
    if (!this.email.includes('@')) {
      this.mensagem = 'Por favor, insira um e-mail válido.';
      return;
    }

    // Validação específica para professores
    if (this.tipo === 'professor' && !this.disciplina.trim()) {
      this.mensagem = 'Informe a disciplina do professor.';
      return;
    }

    // Validação de senhas
    if (this.senha !== this.confirmarSenha) {
      this.mensagem = 'As senhas digitadas não coincidem.';
      return;
    }

    // Estrutura do novo usuário
    const novoUsuario: UsuarioServidor = {
      nome: this.nome.trim(),
      email: this.email.trim().toLowerCase(),
      tipo: this.tipo,
      disciplina: this.tipo === 'professor' ? this.disciplina.trim() : undefined,
      senha: this.senha
    };

    // Resgata usuários do localStorage ou inicia lista vazia
    const cadastrosExistentes: UsuarioServidor[] = JSON.parse(
      localStorage.getItem('usuariosCadastrados') || '[]'
    );

    // Verifica se e-mail já existe
    const emailExiste = cadastrosExistentes.some(
      user => user.email === novoUsuario.email
    );

    if (emailExiste) {
      this.mensagem = 'Este e-mail já está cadastrado no sistema.';
      return;
    }

    // Salva o novo registro
    cadastrosExistentes.push(novoUsuario);
    localStorage.setItem('usuariosCadastrados', JSON.stringify(cadastrosExistentes));

    this.sucesso = true;
    this.mensagem = 'Cadastro realizado com sucesso! Redirecionando...';

    // Redireciona para o login após 2 segundos
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  // ==========================================
  // ALTERNAR VISIBILIDADE DA SENHA
  // ==========================================
  alternarSenha(): void {
    this.mostrarSenha = !this.mostrarSenha;
  }
}