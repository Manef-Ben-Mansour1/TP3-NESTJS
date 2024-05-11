import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CvListener {
  @OnEvent('cv.created')
  async handleCvAdded(payload: any) {
    
    payload['type'] = "cv.created"
    const data = JSON.stringify(payload);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    fetch('https://localhost:9200/cvs/_doc', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA=='
    },
    body: data,
    })
    

  }
  @OnEvent('cv.updated')
  async handleCvUpdated(payload: any) {
    payload['type'] = "cv.updated"
    const data = JSON.stringify(payload);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    fetch('https://localhost:9200/cvs/_doc', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA=='
    },
    body: data,
    })
    
  }
  @OnEvent('cv.deleted')
  async handleCvDeleted(payload: any) {
    //save the logs in a file after stringifying the payload
    payload['type'] = "cv.deleted"
    const data = JSON.stringify(payload);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    fetch('https://localhost:9200/cvs/_doc', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Basic ZWxhc3RpYzppUS1yb1dhUG1zN1NqdFBxRXR5dA=='
    },
    body: data,
    })
   
  }
}