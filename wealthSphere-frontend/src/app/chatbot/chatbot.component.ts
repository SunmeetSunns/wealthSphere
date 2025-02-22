import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
export class ChatbotComponent implements OnInit{
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  messages: { text: string, sender: string }[] = [
    { text: `Hey there! 😊 Welcome to WealthSphere`, sender: 'bot' },
    { text: `I'm Alice, your virtual assistant. How can I assist you today?`, sender: 'bot' },
  ];

  buttons: string[] = ["What is WealthSphere?", "How do I sign up?", "How to setup my account?", "How to add investment?"];
  userInput = '';
  showButtons: boolean = false;
  dropdownOpen: boolean = false;
  helpButtonVisible: boolean = true; // Controls visibility of "Need Help?" button
  quickReplyUsed: boolean = false; // Prevents showing quick reply buttons again
  isTyping: boolean = false; // Tracks if bot is typing
  userData: any;

  ngOnInit(): void {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
      this.buttons.push("View my portfolio");
    }
  }
  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (!this.userInput.trim()) return;
  
    this.messages.push({ text: this.userInput, sender: 'user' });
    this.scrollToBottom();
  
    this.startTypingIndicator(); // Show typing animation
  
    const userMessage = this.userInput;
    this.userInput = '';
  
    const startTime = Date.now();
  
    this.chatbotService.sendMessage(userMessage).subscribe(response => {
      const apiResponseTime = Date.now() - startTime;
  
      const minWaitTime = 2000; // 2 seconds minimum wait
      const remainingTime = Math.max(0, minWaitTime - apiResponseTime);
  
      setTimeout(() => {
        this.handleBotResponse(response);
      }, remainingTime);
    });
  
    // Hide buttons when user sends a message
    this.showButtons = false;
    this.helpButtonVisible = false;
  }
  

  sendQuickReply(text: string) {
    if (this.quickReplyUsed) return; // Prevents quick reply buttons from appearing again

    this.messages.push({ text, sender: 'user' });
    this.scrollToBottom();

    this.startTypingIndicator(); // Start typing animation

    const startTime = Date.now(); // Track when API request starts

    this.chatbotService.sendMessage(text).subscribe(response => {
      const apiResponseTime = Date.now() - startTime; // Time taken for API response

      const minWaitTime = 2000; // 2 seconds minimum wait
      const remainingTime = Math.max(0, minWaitTime - apiResponseTime);

      setTimeout(() => {
        this.handleBotResponse(response);
      }, remainingTime);
    });

    this.showButtons = false;
    this.quickReplyUsed = true;
  }

  handleBotResponse(response: any) {
    this.isTyping = false; // Hide typing indicator
  
    const botMessage = this.formatMessage(response?.response) || "I'm not sure how to respond.";
    this.messages.push({ text: botMessage, sender: 'bot' });
  
    // Hide all buttons once a response is received
    this.showButtons = false;
    this.helpButtonVisible = false;
  
    this.scrollToBottom();
  }
  
  startTypingIndicator() {
    this.isTyping = true;
  }

  showHelpButtons() {
    this.showButtons = true;
    this.helpButtonVisible = false;
    this.scrollToBottom();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectDropdownOption(text: string) {
    this.showButtons = false;
    this.helpButtonVisible = false;
    this.messages.push({ text, sender: 'user' });
    this.scrollToBottom();

    this.startTypingIndicator(); // Start typing animation

    const startTime = Date.now();

    this.chatbotService.sendMessage(text).subscribe(response => {
      const apiResponseTime = Date.now() - startTime;

      const minWaitTime = 2000;
      const remainingTime = Math.max(0, minWaitTime - apiResponseTime);

      setTimeout(() => {
        this.handleBotResponse(response);
      }, remainingTime);
    });

    this.dropdownOpen = false;
  }

  formatMessage(text: string): string {
    return text.replace(/\n/g, '<br/>');
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatMessages?.nativeElement) {
        this.chatMessages.nativeElement.scrollTo({
          top: this.chatMessages.nativeElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  }
}
