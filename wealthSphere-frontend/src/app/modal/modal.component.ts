import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  imports: [CommonModule],
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Input() title: string = 'Modal Title';
  @Output() close = new EventEmitter<void>(); // EventEmitter to notify parent components

  closeModal() {
    this.isVisible = false; // Close modal visibility
    this.close.emit(); // Notify parent component
  }
}
