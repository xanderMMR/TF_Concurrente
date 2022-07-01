import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { KeysResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class CryptService {
  BASE_URL: string = 'https://sheltered-mesa-50817.herokuapp.com/RSA/';
  constructor(private http: HttpClient) {}

  generateKeys(): Observable<any> {
    return this.http.get<any>(this.BASE_URL + 'generate-keys');
  }

  encryptMessage(publicKey: string, message: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const body = {
      public_key: publicKey,
      message: message,
    };
    console.log(body);
    return this.http.post<any>(
      this.BASE_URL + 'encrypt',
      body,
      httpOptions
    );
  }

  decryptMessage(privateKey: string, mess: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    const body = JSON.stringify({
      private_key: privateKey,
      message: mess,
    });
    console.log(body);
    return this.http.post<any>(
      this.BASE_URL + 'decrypt',
      body,
      httpOptions
    );
  }
}
