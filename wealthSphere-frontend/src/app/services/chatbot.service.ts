import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'https://wealtsphere.onrender.com/api/webhook';  // Replace with your ngrok URL

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<any> {
    const requestBody = {
      queryInput: {
        text: {
          text: message,
          languageCode: 'en'
        }
      }
    };
    return this.http.post<any>(this.apiUrl, requestBody);
  }
}
