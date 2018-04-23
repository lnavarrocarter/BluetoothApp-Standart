import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import { BufferarrayProvider } from '../../providers/bufferarray/bufferarray'

// SmartBand Service UUIDs
const SMARTBAND_SERVICE = '1800';
const SMARTBAND_UIDD = '2a04';

const WRITE_SERVICES = 'c3e6fea0-e966-1000-8000-be99c223df6a';
const WRITE_UIDD = 'c3e6fea1-e966-1000-8000-be99c223df6a';
const NOTIFY_SERVICES = 'c3e6fea2-e966-1000-8000-be99c223df6a';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  peripheral: any = {};
  red: number;
  green: number;
  blue: number;
  brightness: number;
  power: boolean;
  connected : boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private ble: BLE,
    private toastCtrl: ToastController,
    private ngZone: NgZone,
    private BufferServices : BufferarrayProvider
  ){
    let device = navParams.get('device');
    this.connected = false;
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.onDeviceDisconnected(peripheral)
    );
  }

  onConnected(peripheral) {
    console.log('Connected to ' + peripheral.name + ' ' + peripheral.id);
    console.log(peripheral);
    this.connected = true;
    this.ngZone.run(() => {
      this.peripheral = peripheral;
    });

    /**Connections Services */
    for(let carasteristica of peripheral.characteristics) {
      for(let propiedad of carasteristica.properties){
          switch (propiedad) {
            case 'Read':
              this.bleRead(peripheral.id,carasteristica.service,carasteristica.characteristic);
            break;
            case 'Indicate':
              this.bleNotify(peripheral.id,carasteristica.service,carasteristica.characteristic);
            break;
            case 'WriteWithoutResponse':
              var msgArray = new Uint16Array([1]);
              this.bleWithoutResponse(peripheral.id,carasteristica.service,carasteristica.characteristic,msgArray)
            break;
            case 'Write':
              var msgArray = new Uint16Array([1]);
              this.bleWrite(peripheral.id,carasteristica.service,carasteristica.characteristic,msgArray)
            break;
            case 'Notify':
              this.bleNotify(peripheral.id,carasteristica.service,carasteristica.characteristic);
            break;
            default:
            console.warn('No exist prop...')
              break;
          }
      };//end for prop
    };//end for carac
  }

  onDeviceDisconnected(peripheral) {
    let toast = this.toastCtrl.create({
      message: 'The peripheral unexpectedly disconnected',
      duration: 3000,
      position: 'center'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
      // TODO navigate back?
    });

    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
      () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
      () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
    )
  }

  /**function del bluetooth Read,Write,Notify,ETC  */
  bleRead(IdMac : string, services: string, uidd: string ){
    this.ble.read(IdMac, services, uidd).then(buffer => this.printBuffer(buffer,'Read'),err => console.warn('Read : ' +err))
  }

  bleWrite(IdMac : string, services: string, uidd: string, buffer: any){
    this.ble.write(IdMac, services, uidd, buffer).then(buffer => this.printBuffer(buffer,'Write'),err => console.warn('Write : ' +err));
  }
  bleWithoutResponse(IdMac : string, services: string, uidd: string, buffer: any){
    this.ble.writeWithoutResponse(IdMac, services, uidd, buffer).then(buffer => this.printBuffer(buffer,'writeWithoutResponse'),err => console.warn('Wor : ' + err));
  }

  bleNotify(IdMac : string, services: string, uidd: string ){
    this.ble.startNotification(IdMac, services, uidd).subscribe(buffer => this.printBuffer(buffer,'notify'),err => console.warn('Notify: ' + err))
  }

  /**function private printbuffer */

  private printBuffer(buffer,type){
    console.log(type);
    console.log(buffer)
    let data = new Uint8Array(buffer);
    let blob = new Blob([data], {type: "archivo application / octet-binario"});
    let reader = new FileReader();
    reader.readAsText(blob);
    this.ngZone.run(() => {
      
    });
    reader.onload = function (e){
      console.info(reader.result);
    }
  }

}
