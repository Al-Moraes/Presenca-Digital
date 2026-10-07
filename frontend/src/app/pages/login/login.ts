import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormGroup, Validators} from '@angular/forms';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  errologin = signal (false);
  
  formulario = new FormGroup ({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  entrar(){
    this.errologin.set(false);

    if(this.formulario.invalid){
      this.formulario.markAsTouched();
      return;
    }
    const email = this.formulario.value.email ?? '';
    const senha = this.formulario.value.senha ?? '';
  }
}
