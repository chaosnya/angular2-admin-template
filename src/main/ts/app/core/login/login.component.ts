import {Component, EventEmitter, Output} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Component({
    selector: 'core-login',
    templateUrl: 'views/core/login/login.html'
})

export class LoginComponent {
    username = ""
    password = ""
    error = false

    constructor(private http: Http) {

        var headers = new Headers()
        headers.append("X-Requested-With", "XMLHttpRequest")

        this.http.get('api/v1/user', {
            headers: headers
        })
            .subscribe(
                response => {
                    this.onLogged.emit(response.json().name != null)
                },
                error => {
                    console.log("login fail")

                })
    }

    @Output() onLogged = new EventEmitter<boolean>();

    login() {
        var headers = new Headers()
        headers.append("X-Requested-With", "XMLHttpRequest")
        headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password))


        this.http.get('api/v1/user', {
            headers: headers
        })
            .subscribe(
                response => {
                    this.onLogged.emit(response.json().name != null)
                },
                error => {
                    this.error = true

                })

    }
}
