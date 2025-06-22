import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    RouterModule
  ]
})
export class AboutPage {
  teamMembers: TeamMember[] = [
    {
      name: 'Nome do Integrante 1',
      role: 'Desenvolvedor Front-end',
      image: 'assets/images/team/member1.jpg',
      description: 'Responsável pelo desenvolvimento da interface do usuário e experiência do usuário.',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: '#'
      }
    },
    {
      name: 'Nome do Integrante 2',
      role: 'Desenvolvedor Back-end',
      image: 'assets/images/team/member2.jpg',
      description: 'Responsável pela integração com APIs e lógica de negócios.',
      socialLinks: {
        github: '#',
        linkedin: '#',
        email: '#'
      }
    }
    // Adicione mais membros conforme necessário
  ];

  private router = inject(Router);

  // Navega de volta para a página anterior
  goBack() {
    this.router.navigate(['/tabs/home']);
  }

  // Trata erros de carregamento de imagem
  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/placeholder-user.jpg'; // Imagem de fallback
  }
}
