import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private countRequest = 0;
  private idMessage: string;
  constructor(
    public message: NzMessageService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.countRequest) {
      this.idMessage = this.message
         .loading('Cargando...', { nzDuration: 0 }).messageId;
    }
    this.countRequest++;
    return next.handle(request)
      .pipe(
        finalize(() => {
          this.countRequest--;
          if (!this.countRequest) {
            this.message.remove(this.idMessage);
          }
        })
      );
  }
}