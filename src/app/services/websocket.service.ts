import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TradeData } from '../models/general.model';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    
  constructor(private toastr: ToastrService) {}

  private socket: WebSocket | undefined;
  private receivedDataSubject: BehaviorSubject<TradeData[]> = new BehaviorSubject<TradeData[]>([]);

  public receivedData$ = this.receivedDataSubject.asObservable();

  public connect(): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(environment.wsBinanceUrl);

      this.socket.onopen = () => {
        this.toastr.show("Connected to Web Socket", 'Success', { timeOut: 3000 });
      };

      this.socket.onmessage = (event) => {
        const data: TradeData = JSON.parse(event.data);
        const updatedData = this.receivedDataSubject.getValue();
        updatedData.push(data);
        this.receivedDataSubject.next(updatedData);
      };
    }
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
      this.toastr.warning("Disconnected to Web Socket", 'Warning', { timeOut: 3000 });
    }
    this.receivedDataSubject.next([]);
  }
}
