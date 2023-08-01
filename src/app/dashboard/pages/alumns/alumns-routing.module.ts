import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnsComponent } from './alumns.component';

const routes: Routes = [
  {
    path:'',
    component: AlumnsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnsRoutingModule { }
