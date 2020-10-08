import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  

  API_URI :string = "http://localhost:8080/api/v1/download/repo";
  constructor(private http : HttpClient) { }

  
  getFile(param){
    console.log("get File", param);
    const opc = new HttpHeaders({ 'Content-Type': 'text' });
    return this.http.post(this.API_URI,param,{ responseType: 'blob' });
  }
}
