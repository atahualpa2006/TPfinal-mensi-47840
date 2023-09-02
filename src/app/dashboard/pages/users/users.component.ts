import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserFormDialogComponent } from './components/user-form-dialog/user-form-dialog.component';
import { User } from './models';
import { UserService } from './user.service';
import { Observable, Subject, Subscription, map, take, tap } from 'rxjs';
import { NotifierService } from 'src/app/core/services/notifier.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnDestroy {
  // public users: User [] = [];

  public users: Observable<User[]>;

  public allSubs: Subscription[] = [];
  public destroyed = new Subject<boolean>();

  constructor(
    private matDialog: MatDialog,
    private userService: UserService,
    private notifier: NotifierService,
    @Inject('IS_DEV') private isDev: boolean
  ) {
    this.userService.loadUsers();

    this.users = this.userService.getUsers();
  }

  onCreateUser(): void {
    this.matDialog
      .open(UserFormDialogComponent)
      .afterClosed()
      .subscribe({
        next: (v) => {
          if (v) {
            this.notifier.showSuccess('Carga exitosa');
            this.userService.createUser({
              name: v.name,
              email: v.email,
              password: v.password,
              surname: v.surname,
              role: v.role,
            });
          }
        },
      });
  }

  onDeleteUser(userToDelete: User): void {
    if (confirm(`Seguro de eliminar a ${userToDelete.name}?`)) {
      this.userService.deleteUserById(userToDelete.id);
      this.notifier.showSuccess('Eliminacion exitosa');
    }




  }

  onEditUser(userToEdit: User): void {
    this.matDialog
      //se abre el modal
      .open(UserFormDialogComponent, {
        data: userToEdit,
      })
      //despues que cierre
      .afterClosed()
      //hago esto, recibo el valor ingresado
      .subscribe({
        next: (userUpdated) => {
          if (userUpdated) {
            this.userService.updateUserById(userToEdit.id, userUpdated);
            this.notifier.showSuccess('Edicion exitosa');
          }
        },
      });
  }

  ngOnDestroy(): void {
    // Aquí no es necesario arrojar una excepción.
    // Puedes realizar aquí las tareas de limpieza necesarias si es que las tienes.
    // Por ejemplo, puedes desuscribirte de las suscripciones almacenadas en allSubs.
    this.allSubs.forEach((sub) => sub.unsubscribe());
    this.destroyed.next(true);
    this.destroyed.complete();
  }
}
