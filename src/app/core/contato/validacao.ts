/**
 * As mesmas regras que o endpoint aplica, repetidas aqui.
 *
 * A repetição é de propósito e não é dívida: validar no navegador serve para a
 * pessoa saber do problema antes de enviar, e validar no servidor serve porque
 * ninguém confia no navegador. As duas listas precisam bater, e o contrato que
 * as amarra está em `doc/08-plano-formulario-e-medicao.md`.
 */

export const IDEIA_MINIMA = 20;
export const IDEIA_MAXIMA = 4000;
export const CONTATO_MINIMO = 5;
export const CONTATO_MAXIMO = 200;

/** Frouxo por escolha: algo, arroba, algo, ponto, algo. */
export function pareceEmail(contato: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contato);
}

/** Oito dígitos ou mais, ignorando parênteses, traço, espaço e o sinal de mais. */
export function pareceTelefone(contato: string): boolean {
  const digitos = contato.replace(/\D/g, '');
  return digitos.length >= 8 && digitos.length <= 15;
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

export function erroDoContato(valor: string): string | null {
  const contato = valor.trim();

  if (contato.length === 0) {
    return 'Preciso de um e-mail ou WhatsApp para responder.';
  }
  if (contato.length > CONTATO_MAXIMO) {
    return 'Ficou longo demais para um contato.';
  }
  if (contato.length < CONTATO_MINIMO || (!pareceEmail(contato) && !pareceTelefone(contato))) {
    return 'Não reconheci isso como e-mail nem como telefone.';
  }
  return null;
}
