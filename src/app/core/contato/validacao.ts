export const NOME_MINIMO = 2;
export const NOME_MAXIMO = 80;
export const IDEIA_MINIMA = 20;
export const IDEIA_MAXIMA = 4000;
export const CONTATO_MINIMO = 5;
export const CONTATO_MAXIMO = 200;

const EMAIL =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
  79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function pareceEmail(contato: string): boolean {
  return EMAIL.test(contato);
}

function pareceTentativaDeTelefone(contato: string): boolean {
  return /\d/.test(contato) && /^[\d\s()+.-]+$/.test(contato);
}

export function pareceCelularComDdd(contato: string): boolean {
  return diagnosticoDoCelular(contato) === 'ok';
}

type DiagnosticoDoCelular = 'ok' | 'tamanho' | 'ddd' | 'sem-nove';

function diagnosticoDoCelular(contato: string): DiagnosticoDoCelular {
  let digitos = contato.replace(/\D/g, '');

  if (digitos.length === 13 && digitos.startsWith('55')) {
    digitos = digitos.slice(2);
  }

  if (digitos.length !== 11) {
    return 'tamanho';
  }
  if (!DDDS.has(Number(digitos.slice(0, 2)))) {
    return 'ddd';
  }
  if (digitos[2] !== '9') {
    return 'sem-nove';
  }
  return 'ok';
}

export function erroDoNome(valor: string): string | null {
  const nome = valor.trim();

  if (nome.length === 0) {
    return 'Diz como eu te chamo.';
  }
  if (nome.length < NOME_MINIMO) {
    return `Nome curto demais. Pelo menos ${NOME_MINIMO} letras.`;
  }
  if (nome.length > NOME_MAXIMO) {
    return `Ficou longo demais. O limite é ${NOME_MAXIMO} caracteres.`;
  }
  if (!/\p{L}/u.test(nome)) {
    return 'Escreva o seu nome, com letras.';
  }
  return null;
}

export function erroDaIdeia(valor: string): string | null {
  const ideia = valor.trim();

  if (ideia.length === 0) {
    return 'Escreva a sua ideia aqui.';
  }
  if (ideia.length < IDEIA_MINIMA) {
    return `Conte um pouco mais, pelo menos ${IDEIA_MINIMA} caracteres.`;
  }
  if (ideia.length > IDEIA_MAXIMA) {
    return `Ficou longo demais. O limite é ${IDEIA_MAXIMA} caracteres.`;
  }
  return null;
}

export function erroDoContato(valor: string): string | null {
  const contato = valor.trim();

  if (contato.length === 0) {
    return 'Preciso de um e-mail ou WhatsApp para responder.';
  }
  if (contato.length > CONTATO_MAXIMO) {
    return 'Ficou longo demais para um contato.';
  }
  if (pareceEmail(contato) || pareceCelularComDdd(contato)) {
    return null;
  }

  if (contato.includes('@')) {
    return 'Esse e-mail não parece certo. O formato é nome@dominio.com.br.';
  }

  if (pareceTentativaDeTelefone(contato)) {
    switch (diagnosticoDoCelular(contato)) {
      case 'ddd':
        return 'Esse DDD não existe. Escreva o celular assim: (11) 98888-7777.';
      case 'sem-nove':
        return 'Celular começa com 9 depois do DDD. Assim: (11) 98888-7777.';
      default:
        return 'Faltou dígito no celular. Precisa do DDD e dos nove números: (11) 98888-7777.';
    }
  }

  return 'Escreva um e-mail válido ou um celular com DDD.';
}
