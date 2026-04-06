import { Component, Inject, ChangeDetectionStrategy, signal, OnInit, inject} from '@angular/core';
import { Pokemon } from '../pokemon';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
import { from } from 'rxjs';

@Component({
  selector: 'app-pokemon-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.html',
  styleUrl: './pokemon-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  })
PokemonService = inject(Pokemon);
ngOnInit() {
  this.PokemonService.fetchPokemon();
}

onSubmit(){
  if(this.pokemonForm.invalid) return;

  const data = this.pokemonForm.getRawValue();
  this.PokemonService.savePokemon(data).subscribe({
    next: () => {
      this.PokemonService.fetchPokemon();
      this.pokemonForm.reset();
    },
    error: (err) => console.error("Save Failed", err)
  });
}
}
