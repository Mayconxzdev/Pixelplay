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
  responsibilities: string[];
  technologies: string[];
  socialLinks: {
    github: string;
    linkedin: string;
    email: string;
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
      name: 'Lucas',
      role: 'Desenvolvedor Full Stack',
      image: 'assets/images/team/Lucas.jpg',
      description: 'Apaixonado por criar experiências digitais incríveis que unem design e tecnologia.',
      responsibilities: [
        'Desenvolvimento do backend',
        'Integração com a API do TMDb',
        'Gerenciamento de estado com NgRx'
      ],
      technologies: ['Angular', 'Node.js', 'Firebase', 'NgRx'],
      socialLinks: {
        github: 'https://github.com/lucas-dev',
        linkedin: '#',
        email: 'lucas@exemplo.com'
      }
    },
    {
      name: 'Maycon',
      role: 'Desenvolvedor Full Stack',
      image: 'assets/images/team/Maycon.jpg',
      description: 'Focado em criar soluções inovadoras e eficientes que resolvem problemas reais dos usuários.',
      responsibilities: [
        'Arquitetura do frontend',
        'Implementação de funcionalidades',
        'Otimização de performance'
      ],
      technologies: ['Ionic', 'Angular', 'TypeScript', 'SCSS'],
      socialLinks: {
        github: 'https://github.com/mayconxzdev',
        linkedin: '#',
        email: 'contato@mayconferreira.com'
      }
    },
    {
      name: 'Gabriel',
      role: 'UI/UX Designer & Front-end',
      image: 'assets/images/team/Gabriel.jpg',
      description: 'Criando interfaces intuitivas e bonitas que melhoram a experiência do usuário.',
      responsibilities: [
        'Design de interface',
        'Experiência do usuário',
        'Design responsivo'
      ],
      technologies: ['Figma', 'Adobe XD', 'HTML/CSS', 'Angular Material'],
      socialLinks: {
        github: 'https://github.com/gabriel-dev',
        linkedin: '#',
        email: 'gabriel@exemplo.com'
      }
    }
  ];

  projectDescription = {
    title: 'Sobre o PixelPlay',
    content: 'O PixelPlay é um aplicativo mobile desenvolvido para os amantes de cinema, oferecendo uma experiência rica e imersiva na descoberta e exploração de filmes. Desenvolvido com Angular 19+ e Ionic Framework 8.5.8, nosso aplicativo consome a API do TMDb para trazer informações atualizadas sobre filmes, incluindo lançamentos, avaliações e muito mais.',
    stack: ['Angular 19+', 'Ionic 8.5.8', 'TMDb API', 'NgRx', 'TypeScript', 'SCSS']
  };

  missionStatement = {
    title: 'Nossa Missão',
    content: 'Nossa missão é proporcionar a melhor experiência possível para os fãs de cinema, combinando design intuitivo, desempenho excepcional e conteúdo rico. Acreditamos que assistir a um filme deve ser uma experiência mágica desde o momento em que você abre o aplicativo até os créditos finais.'
  };

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
