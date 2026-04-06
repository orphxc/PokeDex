import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PokemonForm } from './pokemon-form/pokemon-form';


@Component({
  selector: 'app-root',
  imports: [PokemonForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('pokemon-catcher');
}
