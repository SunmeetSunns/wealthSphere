import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatbotService } from '../services/chatbot.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatbotComponent {
  @ViewChild('chatMessages') chatMessages!: ElementRef;
  messages: { text: string, sender: string }[] = [
    { text: `Hey there! 😊 Welcome to WealthSphere`, sender: 'bot' },
    { text: `I'm Alice, your virtual assistant. How can I assist you today?`, sender: 'bot' },
  ];
  userInput = '';

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (!this.userInput.trim()) return; // Prevent sending empty messages

    // Add user message
    this.messages.push({ text: this.userInput, sender: 'user' });
    const userMessage = this.userInput;
    this.userInput = ''; // Clear input field

    // Scroll to bottom after user message
    this.scrollToBottom();

    // Call chatbot service
    this.chatbotService.sendMessage(userMessage).subscribe(response => {
      const botMessage = response?.response || "I'm not sure how to respond.";
      this.messages.push({ text: botMessage, sender: 'bot' });
      this.scrollToBottom(); // Ensure smooth scroll after bot reply
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatMessages.nativeElement.scrollTo({
        top: this.chatMessages.nativeElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  }
}
