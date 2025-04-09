import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [RouterModule],
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  @Input() headerTitle: string = 'Desafio Full Stack';
}
