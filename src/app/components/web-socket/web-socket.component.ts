import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-web-socket',
  templateUrl: './web-socket.component.html',
  styleUrls: ['./web-socket.component.scss']
})
export class WebSocketComponent implements OnInit, OnDestroy {
  receivedDataSubscription: Subscription | undefined;

  constructor(public ws: WebsocketService) { }

  ngOnInit(): void {
  }

  connect(): void {
    this.ws.connect();
    this.receivedDataSubscription = this.ws.receivedData$.subscribe();
  }

  close(): void {
    this.ws.close();
    if (this.receivedDataSubscription) {
      this.receivedDataSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.close();
  }
}
