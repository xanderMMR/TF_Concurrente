import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { KeysResponse } from './interfaces/responses';
import { Product } from './interfaces/product';
import { CryptService } from './services/crypt.service';
import {MatTableModule} from '@angular/material/table'
import { HttpClient } from "@angular/common/http";
function validKey(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;
        if(!value){
          return null
        }
        if (!value.includes('$')) {
            return null;
        }

        return !value.includes('$') ? {goodKey:true}: null;
    }
}


// interface Product {
//   name: string;
//   category: string;
//   brand: string;
// }

// const ELEMENT_DATA: Product[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
//   {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
//   {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
// ];  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})


export class AppComponent implements OnInit {
  pubKey: string;
  privKey: string;
  cryptMess: string;
  plainMess: string;
  encryptForm: FormGroup;
  decryptForm: FormGroup;
  read: FormGroup;
  name: string;
  category: string;
  brand: string;
  buscarId: FormGroup;
  i: boolean;
  // --------
  displayedColumns: string[] = ['name', 'category', 'brand'];
  dataSource : {};


  constructor( private cryptService: CryptService, private _fb: FormBuilder,private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get("http://localhost:8080/").subscribe(data => {
      this.dataSource = data;
    });
    this.encryptForm = this._fb.group({
      plainText: [null, [Validators.required]],
      publicKey: [null, [Validators.pattern]],
      cryptText: [null]
    });

    this.decryptForm = this._fb.group({
      cryptText: [null, [Validators.required]],
      privateKey: [null, [Validators.pattern]],
      plainText: [null]
    });

    this.read = this._fb.group({
      name: [''],
      category: [''],
      brand: ['']
    });

    this.buscarId = this._fb.group({
      id: ['']
    });

  }

  getMessage(b: boolean){
    if (b){
      alert('👦🏻')
    }
    else{
      alert('👦🏿')
    }
  }

  getKeys() {
    this.cryptService.generateKeys().subscribe((res) => {
      this.privKey = res.private_key;
      this.pubKey = res.public_key;
    });
  }

  send(): any {
    console.log(this.read.value);
  }

  send_id(): any {
    console.log(this.buscarId.value);
  }

  send_net(): any {
    console.log("Blockchain Net");
  }

  encryptMessage() {

    console.log(
        this.encryptForm.controls['publicKey'].value,
    )
    if (this.encryptForm.valid) {
      this.cryptService.encryptMessage(
        this.encryptForm.controls['publicKey'].value,
        this.encryptForm.controls['plainText'].value
      )
      .subscribe(
        (res) => {
          console.log(res)
          this.cryptMess = res.cryptMessage
        }
      )
    } else {
      Object.values(this.encryptForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  decryptMessage() {
    if (this.decryptForm.valid) {
      console.log("Hola")
      this.cryptService.decryptMessage(
        this.decryptForm.controls['privateKey'].value,
        this.decryptForm.controls['cryptText'].value
      )
      .subscribe(
        (res) => {
          console.log("la respuesta es", res)
          this.plainMess = res.decryptMessage
        }
      )
    } else {
      Object.values(this.decryptForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

}
