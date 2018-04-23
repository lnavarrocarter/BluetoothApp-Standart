import { Injectable } from '@angular/core';
import { base64 } from 'base-64';


@Injectable()
export class BufferarrayProvider {
  binary : string;
  bytes : any;
  constructor() {
    
  }

  toBase64(arrayBuffer) {
    this.binary = '';
    this.bytes = new Uint8Array(arrayBuffer);
    let len = this.bytes.byteLength;
    for (var i = 0; i < len; i++) {
      this.binary += String.fromCharCode(this.bytes[i]);
    }
    console.info(btoa(this.binary));
    return btoa(this.binary);
  }

  toString(arrayBuffer) {
    try {
      let base64dat = this.toBase64(arrayBuffer);
      console.info(base64.decode(base64dat));
      return base64.decode(base64dat);
    } catch (e) {
      console.warn('Can not be converted to String');
      return false;
    }
  }

  toJSON(arrayBuffer) {
    try {
      let string: any = this.toString(arrayBuffer);
      return JSON.parse(string);
    } catch (e) {
      console.warn('Can not be converted to JSON');
      return false;
    }
  }

}
