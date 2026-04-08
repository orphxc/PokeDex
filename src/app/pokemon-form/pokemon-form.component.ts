import { Component, inject, ChangeDetectionStrategy, signal, OnInit, runInInjectionContext } from '@angular/core';
import { PokemonService } from '../pokemon.service';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms'
@Component({
  selector: 'app-pokemon-form',
  imports: [ReactiveFormsModule],
  templateUrl: './pokemon-form.component.html',
  styleUrl: './pokemon-form.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PokemonFormComponent implements OnInit{
  private formBuilder = inject(FormBuilder);
  editingId =signal<string | null>(null)

  pokemonForm = this.formBuilder.nonNullable.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    level: [1, [Validators.required, Validators.min(1)]],
    nature: ['', Validators.required],
  });

  pokemonService = inject(PokemonService);
  ngOnInit(){
    this.pokemonService.fetchPokemon();
  }

  deletePokemon(id: string){
    if(confirm("Are you sure you want to release this pokemon?")){
      this.pokemonService.deletePokemon(id);
    }
    this.pokemonService.fetchPokemon();
  }

  startEdit(pokemon: any){
    this.editingId.set(pokemon._id);
    this.pokemonForm.patchValue(pokemon);
  }

  cancelEdit(){
    this.editingId.set(null);
    this.pokemonForm.reset();
  }

  onSubmit(){
    if(this.pokemonForm.invalid) return;

    const data = this.pokemonForm.getRawValue();
    const  id = this.editingId();

    if(id){
      this.pokemonService.updatePokemon(id, data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.cancelEdit();
        },
        error: (err) => console.error('Update Failed!', err)
      })
    } else {
      this.pokemonService.savePokemon(data).subscribe({
        next: () => {
          this.pokemonService.fetchPokemon();
          this.pokemonForm.reset();
        },
        error: (err) => console.error('Save Failed', err)
      });
    }
  }
}
