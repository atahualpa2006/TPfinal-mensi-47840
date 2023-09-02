import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.services';
import { Store } from '@ngrx/store';
import { Observable, observable } from 'rxjs';
import { selectAuthUserRole } from 'src/app/store/auth/auth.selector';
import { selectIsAdmin } from '../../../store/auth/auth.selector';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {

// public selectIsAdmin$ : Observable <boolean>;
  public role$: Observable < 'ADMINISTRADOR' | 'USUARIO' | undefined>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
    ) {
      this.role$ = this.store.select(selectAuthUserRole);
      // this.selectIsAdmin$ = this.store.select (selectIsAdmin);
    }

  logout():void {

    this.authService.logout();
    this.router.navigate(['auth','login'], {


    })
  }

}

