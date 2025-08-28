# PixelPlay - Seu Catálogo de Filmes Favorito 🎬

[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)](https://ionicframework.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)

E aí, pessoal! 👋

O PixelPlay é um projeto que criei para colocar em prática meus conhecimentos em desenvolvimento web e mobile. É basicamente um catálogo de filmes onde você pode descobrir os filmes do momento, ver o que está por vir e até salvar seus favoritos.

Desenvolvi usando Angular e Ionic, então ele funciona tanto no navegador quanto como app móvel (obrigado, Capacitor! 🙌). A ideia era criar algo que fosse bonito, rápido e fácil de usar.

## 🎯 O que tem de legal aqui?

- 🔍 **Busca esperta** - Encontre aquele filme que você tá doido pra assistir
- 🎬 **Detalhes completos** - Sinopse, elenco, avaliação e muito mais
- 🏆 **Destaques** - Veja o que tá bombando, o que vai lançar e os melhores avaliados
- 🎭 **Pra todo gosto** - Filtre por gênero e encontre exatamente o que você tá afim
- 🔐 **Sua conta** - Crie seu perfil e salve seus filmes favoritos
- 📱 **Em qualquer lugar** - Use no celular, tablet ou computador
- ⚡ **Rápido e offline** - Funciona até sem internet (quase mágica, né?)

## 🛠️ No meu cinto de utilidades

- **Frontend**: Angular 19 (o mais novo, né?)
- **UI Framework**: Ionic 8.5.8 (pra deixar bonitão no celular)
- **Estado da arte**: NgRx (porque gerenciar estado tem que ser fácil)
- **Segurança**: Firebase Auth (pra ninguém invadir sua conta)
- **Dados**: Firestore (opcional, mas muito útil)
- **Mobile**: Capacitor 7.4.0 (pra transformar em app de verdade)
- **UI**: Angular Material 19.2.17 (botãozinho bonito é tudo)
- **Efeitos**: Swiper 8.0.0 (pra deslizar que é uma beleza)
- **Testes**: Jasmine e Karma (porque ninguém merece app quebrado)

## 📱 Onde roda?

- **Web** (PWA) - No navegador, como um site normal
- **Android** - Baixa na Play Store (ou instala o APK, se quiser)
- **iOS** - Também roda, mas precisa de um Mac pra gerar o app (quem tem iPhone sabe como é...)

## 🚀 Bora rodar isso aqui?

### Antes de começar...

Vai precisar ter instalado:
- Node.js 18+ (se não tiver, baixa lá no site deles)
- npm 9+ (ou yarn, se você for do time que gosta de amarelo)
- Angular CLI (aquele `npm i -g @angular/cli` que a gente ama)
- Ionic CLI (opcional, mas ajuda bastante)

### Mão na massa!

1. **Clona o repositório** (você já deve ter feito isso, né?)
   ```bash
   git clone https://github.com/Mayconxzdev/Pixelplay.git
   cd Pixelplay
   ```

2. **Instala as paradas** (vai tomar um café, isso pode demorar um pouco)
   ```bash
   npm install
   # ou se você é do time do yarn
   yarn
   ```

3. **Configura o Firebase** (se liga que é importante)
   - Faz uma cópia do `environment.example.ts` pra `environment.ts`
   - Cola suas credenciais do Firebase lá (se não tiver, me avisa que te ajudo)

4. **Liga o motor**
   ```bash
   npm start
   # ou
   ng serve
   ```

5. **Abre no navegador**
   Dá uma olhada em [http://localhost:4200](http://localhost:4200) e vê se tá tudo funcionando!

### Build para Produção

```bash
# Build para web
npm run build

# Build para Android
npm run build
npx cap add android
npx cap sync android
npx cap open android

# Build para iOS (apenas em macOS)
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/      # Componentes reutilizáveis
│   ├── core/            # Serviços, guards e lógica central
│   │   ├── guards/      # Guards de rota
│   │   ├── interceptors/
│   │   ├── models/      # Interfaces e tipos
│   │   ├── services/    # Serviços globais
│   │   └── store/       # Configuração do NgRx
│   ├── home/            # Página inicial
│   ├── pages/           # Páginas do aplicativo
│   │   ├── login/       # Autenticação
│   │   ├── movie-details/ # Detalhes do filme
│   │   ├── search/      # Busca de filmes
│   │   └── tabs/        # Navegação por abas
│   └── shared/          # Recursos compartilhados
│       ├── components/  # Componentes compartilhados
│       ├── directives/  # Diretivas personalizadas
│       ├── pipes/       # Pipes personalizados
│       └── utils/       # Utilitários
├── assets/              # Recursos estáticos
│   ├── icon/           # Ícones do aplicativo
│   ├── images/         # Imagens
│   └── shapes.svg      # Formas SVG
└── environments/        # Configurações de ambiente
```

## 🔧 Configuração do Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Adicione um aplicativo da Web ao seu projeto Firebase
3. Copie as credenciais do Firebase para o arquivo `environment.ts`
4. Habilite o método de autenticação desejado (Email/Senha, Google, etc.)

## 📱 Build para Dispositivos Móveis

### Android

1. Certifique-se de ter o Android Studio instalado
2. Execute:
   ```bash
   npx cap add android
   npx cap sync
   npx cap open android
   ```
3. No Android Studio, clique em "Run" para executar no emulador ou dispositivo físico

### iOS (apenas em macOS)

1. Certifique-se de ter o Xcode instalado
2. Execute:
   ```bash
   npx cap add ios
   npx cap sync
   npx cap open ios
   ```
3. No Xcode, clique em "Run" para executar no simulador ou dispositivo físico

## 🧪 Testes

```bash
# Executar testes unitários
npm test

# Executar testes em modo watch
ng test

# Executar testes de cobertura
ng test --code-coverage

# Executar lint
ng lint
```

## 🤝 Contribuição

1. Faça um Fork do projeto
2. Crie uma Branch para sua Feature (`git checkout -b feature/AmazingFeature`)
3. Adicione suas mudanças (`git add .`)
4. Comite suas mudanças (`git commit -m 'Adiciona alguma feature incrível'`)
5. Faça o Push da Branch (`git push origin feature/AmazingFeature`)
6. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## ✨ Agradecimentos

- [The Movie Database (TMDb) API](https://www.themoviedb.org/)
- [Ionic Framework](https://ionicframework.com/)
- [Angular](https://angular.io/)
- [Firebase](https://firebase.google.com/)

---

Desenvolvido com ❤️ por [Seu Nome] | [GitHub](https://github.com/Mayconxzdev)
