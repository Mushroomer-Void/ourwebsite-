import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss'
})
export class SplashScreenComponent implements OnInit {
  showSplash = signal(true);

  ngOnInit(): void {
    setTimeout(() => {
      this.showSplash.set(false);
    }, 2500);
  }
}
