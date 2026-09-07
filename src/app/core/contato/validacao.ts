/**
 * As regras que o formulário aplica antes de enviar.
 *
 * Validar no navegador serve para a pessoa saber do problema antes de enviar, e
 * validar no servidor serve porque ninguém confia no navegador. O contrato do
 * endpoint está em `doc/08-plano-formulario-e-medicao.md`.
 *
 * **O navegador é mais estrito que o endpoint, de propósito.** Lá o campo de
 * contato passa com "e-mail ou telefone" em sentido largo; aqui só passa e-mail
 * bem formado ou celular brasileiro com DDD. A diferença é segura porque anda em
 * uma direção só: tudo que o site aprova o endpoint também aprova. O ganho é a
 * mensagem na hora, para quem digitou o número sem o DDD ou trocou o ponto do
 * domínio, em vez de a resposta se perder por um contato que não existe.
 */

export const NOME_MINIMO = 2;
export const NOME_MAXIMO = 80;
export const IDEIA_MINIMA = 20;
export const IDEIA_MAXIMA = 4000;
export const CONTATO_MINIMO = 5;
export const CONTATO_MAXIMO = 200;

/**
 * Estrito o suficiente para pegar o erro de digitação, e não mais que isso.
 * Exige local, arroba, domínio com pelo menos um ponto e terminação de duas
 * letras ou mais. `a@b` e `pessoa@empresa.c` caem aqui; `nome.sobrenome@
 * empresa.com.br` passa.
 */
const EMAIL =
  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}$/;

/**
 * Os DDDs que existem no plano de numeração brasileiro. A lista fechada é o que
 * transforma "faltou um dígito" em mensagem certa: sem ela, `1198888777` (dez
 * dígitos) e `41988887777` seriam indistinguíveis de um número válido com o
 * DDD errado.
 */
const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43,
  44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77,
  79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

export function pareceEmail(contato: string): boolean {
  return EMAIL.test(contato);
}

/**
 * Só dígitos, parênteses, traço, espaço, ponto e o sinal de mais. Serve para
 * separar "isso era para ser um telefone" de "isso não era telefone nenhum", e é
 * o que decide qual das duas mensagens de erro aparece.
 */
function pareceTentativaDeTelefone(contato: string): boolean {
  return /\d/.test(contato) && /^[\d\s()+.-]+$/.test(contato);
}

/**
 * Celular brasileiro com DDD: onze dígitos, o nono dígito na frente do número,
 * e o `55` do país opcional. Fixo de oito dígitos não passa — a promessa da tela
 * é responder por WhatsApp, e fixo não atende a isso.
 *
 * Aceita `(11) 98888-7777`, `11988887777`, `+55 11 98888 7777`.
 */
export function pareceCelularComDdd(contato: string): boolean {
  return diagnosticoDoCelular(contato) === 'ok';
}

type DiagnosticoDoCelular = 'ok' | 'tamanho' | 'ddd' | 'sem-nove';

function diagnosticoDoCelular(contato: string): DiagnosticoDoCelular {
  let digitos = contato.replace(/\D/g, '');

  // O `55` do país só é descartado quando sobra exatamente um celular inteiro.
  // Sem essa conferência, um `5511` digitado como DDD viraria número válido.
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

/**
 * Como chamar quem escreveu, na hora de responder. Exige uma letra de verdade,
 * o que recusa `...` e `12345` sem exigir sobrenome, acento ou formato: gente se
 * apresenta como quer, e cobrar nome completo aqui só espantaria.
 */
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

/** `null` quando está tudo certo. Quando não, o texto que aparece sob o campo. */
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

/**
 * A mensagem muda conforme o que a pessoa tentou escrever. Quem digitou um
 * e-mail torto não precisa ouvir falar de DDD, e quem esqueceu o DDD não
 * precisa ouvir falar de arroba.
 */
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
