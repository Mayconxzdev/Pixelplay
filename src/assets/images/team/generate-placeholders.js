const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

// Configurações
const IMAGE_SIZE = 400;
const OUTPUT_DIR = path.join(__dirname, 'team');
const TEAM_MEMBERS = [
  { name: 'Maycon Ferreira', filename: 'maycon.jpg' },
  { name: 'João Silva', filename: 'joao.jpg' },
  { name: 'Maria Oliveira', filename: 'maria.jpg' }
];

// Cria o diretório de saída se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Função para gerar um gradiente de cores baseado no nome
function generateGradient(ctx, name) {
  // Gera cores consistentes baseadas no nome
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const h = Math.abs(hash % 360);
  const color1 = `hsl(${h}, 70%, 50%)`;
  const color2 = `hsl(${(h + 30) % 360}, 70%, 40%)`;

  const gradient = ctx.createLinearGradient(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  
  return gradient;
}

// Função para gerar as iniciais
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Gera uma imagem para cada membro da equipe
TEAM_MEMBERS.forEach(member => {
  const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
  const ctx = canvas.getContext('2d');
  
  // Fundo com gradiente
  ctx.fillStyle = generateGradient(ctx, member.name);
  ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);
  
  // Texto com as iniciais
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Tamanho da fonte baseado no tamanho da imagem
  const fontSize = IMAGE_SIZE / 3;
  ctx.font = `bold ${fontSize}px Arial`;
  
  // Desenha as iniciais
  ctx.fillText(getInitials(member.name), IMAGE_SIZE / 2, IMAGE_SIZE / 2);
  
  // Salva a imagem
  const out = fs.createWriteStream(path.join(OUTPUT_DIR, member.filename));
  const stream = canvas.createJPEGStream({
    quality: 0.95,
    chromaSubsampling: false
  });
  
  stream.pipe(out);
  
  out.on('finish', () => {
    console.log(`Imagem gerada: ${member.filename}`);
  });
});

console.log('Todas as imagens foram geradas com sucesso!');
