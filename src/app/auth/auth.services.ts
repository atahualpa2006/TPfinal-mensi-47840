import { Injectable } from "@angular/core";
import { loginPayload } from "./models";
import { User } from "../dashboard/pages/users/models";
import { BehaviorSubject, Observable, map, take } from "rxjs";
import { NotifierService } from "../core/services/notifier.service";
import { Router } from "@angular/router";



@Injectable ({ providedIn: 'root'})
export class  AuthService {

    private _authUser$ = new BehaviorSubject <User | null> (null);
    public authUser$ = this._authUser$.asObservable();

    constructor (private notifier: NotifierService, private router: Router) {}

        isAuthenticated() : Observable <boolean> {
            return this.authUser$.pipe(
            take(1),
            map((user) => !!user),
            );
        }



        login (payLoad: loginPayload): void {
        const MOCK_USER: User = {
        id: 50,
        name:'Mockname',
        surname:'Mocksurname',
        email:'mock@mail.com',
        password:'1',
        }

        if (payLoad.email === MOCK_USER.email && payLoad.password === MOCK_USER.password) {

            this._authUser$.next(MOCK_USER);
            this.router.navigate(['/dashboard/home']);
        } else {
            this.notifier.showError('Email o contrasena invalida');
            this._authUser$.next(null);
        }

    }    

}

