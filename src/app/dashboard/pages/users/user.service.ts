import { Injectable } from '@angular/core';
import { CreateUserData, UpDateUserData, User } from './models';
import { BehaviorSubject, Observable, Subject, delay, map, mergeMap, of, take } from 'rxjs';
import { UserMockService } from './mocks/user-mocks.service';
import { NotifierService } from 'src/app/core/services/notifier.service';
import { HttpClient } from '@angular/common/http';


// const USER_DB : Observable <User[]> = of ([

//   {
//     id: 1,
//     name:'marcos',
//     surname:'rodriguez',
//     email:'mark@.com',
//     password:'123456',
//   },

//   {
//    id: 2,
//    name:'juan',
//    surname:'paez',
//    email:'paez@.com',
//    password:'123456',
//  }

// ]).pipe(delay(1000));



@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _users$ = new BehaviorSubject <User[]> ([]);

  private users$ = this._users$.asObservable ();


  constructor( private notifier : NotifierService, private httpClient : HttpClient) { }

  loadUsers(): void {
    this.httpClient.get <User[]>(' http://localhost:3000/users').subscribe({
      next: (response) => {
        // 
        this._users$.next(response);

      }
    })


    // USER_DB.subscribe ({
    //   next: (usuariosFromDb) => this._users$.next(usuariosFromDb),
    // });
  }


  getUsers() : Observable <User []> {
    return this.users$;
  }

    




  getUserById (id: number) : Observable < User | undefined> {
    return this.users$.pipe(
      map(( users ) => users.find((u) => u.id === id)),
      take(1),
    )
  }


  createUser ( user: CreateUserData): void{
   
  //       this.users$.pipe(take(1)).subscribe({
  //         next:(arrayActual) => {
  //           this._users$.next([
  //             ...arrayActual,
  //             {...user, id: arrayActual.length + 1},
  //           ]);
  //           this.notifier.showSuccess ('Usuario creado');
  //           },
  //         });

  // con HTTP client

          this.httpClient.post  <User>  ( 'http://localhost:3000/users', user)
          .pipe(
            mergeMap((userCreate) => this.users$.pipe(
              take(1),
              map(
                (arrayActual) => [...arrayActual, userCreate])
              )
            )
          )
          .subscribe({
            next: (arrayActualizado) => {
              this._users$.next(arrayActualizado);
            }
          })  
          }
          


        
   


  updateUserById (id: number, usuarioActualizado: UpDateUserData): void {
    this.users$.pipe(take(1)).subscribe({
     next: (arrayActual) => {
      this._users$.next (
        arrayActual.map((u) =>
        u.id === id ? {...u, ...usuarioActualizado}: u
        )
      );
      this.notifier.showSuccess('Usuario actualizado con exito')
     }, 
    });
  }

  deleteUserById (id: number): void {
    // this._users$.pipe(take(1)).subscribe({
    //   next: (arrayActual) => {
    //   this._users$.next(arrayActual.filter((u) => u.id !== id));
    //   this.notifier.showSuccess('Usuario eliminado con exito')
    //   },
    // });

      // http client

      // Logica de resolucion
// 1- comunicarme con la API y eliminar usuario
// 2- actualizar listado (array de usuario)

            // OBSERVABLE 1

    this.httpClient.delete('http://localhost:3000/users/' + id)
    .pipe(
      mergeMap(
        // en este punto la comunicacion ya sucedio (punto 1)
              // OBSERVABLE 2
        (responseUserDelete) => this.users$.pipe(
          take(1),
          map ((arrayActual) => arrayActual.filter((u) => u.id !==id))
        )
      )
    ).subscribe({
      next: (arrayActualizado) => this._users$.next(arrayActualizado),
    })

  }
}
