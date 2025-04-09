import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentTitle: string = 'Desafio Full Stack';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle(event.url);
      }
    });
  }

  private updateTitle(url: string): void {
    if (url === '/empresas' || url === '/empresas/cadastrar' || url === '/empresas/editar/:id') {
      this.currentTitle = 'Gestão de Empresas';
    } else if (url === '/fornecedores' || url === '/fornecedores/cadastrar' || url === '/fornecedores/editar/:id') {
      this.currentTitle = 'Gestão de Fornecedores';
    } else {
      this.currentTitle = 'Desafio Full Stack';
    }
  }
}
