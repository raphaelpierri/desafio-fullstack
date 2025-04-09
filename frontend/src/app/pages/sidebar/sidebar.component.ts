import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { path: '/home', title: 'Home', icon: 'house' },
    { path: '/empresas', title: 'Empresas', icon: 'building' },
    { path: '/fornecedores', title: 'Fornecedores', icon: 'people' }
  ];
}
