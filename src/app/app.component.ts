import { ValueTransformer } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { KeysResponse } from './interfaces/responses';
import { Product } from './interfaces/product';
import { CryptService } from './services/crypt.service';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { MatGridListModule } from '@angular/material/grid-list';
function validKey(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    if (!value.includes('$')) {
      return null;
    }

    return !value.includes('$') ? { goodKey: true } : null;
  };
}

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
  id: number;
  read: FormGroup;
  name: string;
  category: string;
  brand: string;
  serie: string;
  buscarId: FormGroup;
  i: boolean;
  // --------
  id_producto: number = 0;
  displayedColumns: string[] = ['name', 'category', 'brand'];
  dataSource: {};
  data_product: [];

  constructor(
    private cryptService: CryptService,
    private _fb: FormBuilder,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.encryptForm = this._fb.group({
      plainText: [null, [Validators.required]],
      publicKey: [null, [Validators.pattern]],
      cryptText: [null],
    });

    this.decryptForm = this._fb.group({
      cryptText: [null, [Validators.required]],
      privateKey: [null, [Validators.pattern]],
      plainText: [null],
    });

    this.read = this._fb.group({
      id: 4,
      name: [''],
      category: [''],
      brand: [''],
      serie: ['']
    
    });

    this.buscarId = this._fb.group({
      id: [''],
    });
  }
  getProducts() {
    this.http.get('http://localhost:8080/api/products').subscribe((data) => {
      this.dataSource = data;
    });
  }
  getProductById(){
    this.http.get(`http://localhost:8080/${this.buscarId.controls['id'].value}`).subscribe(data => {
        if (data['status']!=null){
        this.name = data['name']
        this.brand = data['brand']
        this.category = data['category']
        this.serie = data['serie']
      }
      else{
        alert (data['status'])
      }
      
    }, (error)=>{
      alert ('El producto no existe')
    } 
    );
  }
  productToUpdate(){
    this.http.get(`http://localhost:8080/${this.buscarId.controls['id'].value}`).subscribe(data => {

        this.name = data['name']
        this.brand = data['brand']
        this.category = data['category']

      
    }, (error)=>{
      alert('El producto no existe')
    }
    );
  }
  postProduct() {
    // console.log(this.read.controls['name'].value)
    const data = {
      name: this.read.controls['name'].value,
      category: this.read.controls['category'].value,
      brand: this.read.controls['brand'].value,
    };
    console.log(data);
    this.http
      .post('http://localhost:8080/api/products', data)
      .subscribe((result) => {
        console.log(result);
      });
  }

  UpdateProduct(){
    // console.log(this.read.controls['name'].value)
    const data ={
      id: "4",
      name: this.read.controls['name'].value,
      category: this.read.controls['category'].value,
      brand: this.read.controls['brand'].value
    }
    console.log(data)
    this.http.post("http://localhost:8080/",data).subscribe(result=>{
      console.log(result)
    })
      
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
    console.log('Blockchain Net');
  }

  encryptMessage() {
    console.log(this.encryptForm.controls['publicKey'].value);
    if (this.encryptForm.valid) {
      this.cryptService
        .encryptMessage(
          this.encryptForm.controls['publicKey'].value,
          this.encryptForm.controls['plainText'].value
        )
        .subscribe((res) => {
          console.log(res);
          this.cryptMess = res.cryptMessage;
        });
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
      console.log('Hola');
      this.cryptService
        .decryptMessage(
          this.decryptForm.controls['privateKey'].value,
          this.decryptForm.controls['cryptText'].value
        )
        .subscribe((res) => {
          console.log('la respuesta es', res);
          this.plainMess = res.decryptMessage;
        });
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
