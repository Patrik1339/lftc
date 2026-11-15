export type Lang = 'ro' | 'en';

/** A proof for an arbitrary p, written symbolically (HTML). */
export interface GeneralProof {
  /** The chosen word, as a function of p. */
  word: string;
  /** Why w ∈ L and |w| ≥ p. */
  inL: string;
  /** What conditions |xy| ≤ p and |y| ≥ 1 force x, y, z to look like. */
  split: string;
  /** The general form of xyⁱz. */
  pumped: string;
  /** The chosen i and why xyⁱz ∉ L. */
  contradiction: string;
}

export interface PumpingLanguage {
  id: string;
  /** Display form of the language (HTML allowed). */
  label: string;
  /** Membership test. */
  inL: (w: string) => boolean;
  /** The word w ∈ L with |w| ≥ p used for the concrete example. */
  word: (p: number) => string;
  /** Symbolic form of the concrete word (HTML). */
  wordLabel: (p: number) => string;
  /** The general proof, valid for every p ≥ 1. */
  proof: Record<Lang, GeneralProof>;
  /** Largest p offered for the concrete example (keeps words drawable). */
  maxP?: number;
}

const count = (w: string, c: string) => [...w].filter((x) => x === c).length;
const sup = (base: string, e: string | number) => `${base}<sup>${e}</sup>`;
const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
export const nextPrime = (n: number) => {
  let k = Math.max(2, n);
  while (!isPrime(k)) k++;
  return k;
};

const a = (e: string | number) => sup('a', e);
const b = (e: string | number) => sup('b', e);
const c = (e: string | number) => sup('c', e);
const xyiz = 'xy<sup>i</sup>z';

/**
 * The step shared by every word that starts with p a's: conditions (1) |xy| ≤ p and (2) |y| ≥ 1
 * force x and y to lie inside the first block of a's.
 */
const splitInAs = (zTail: string): Record<Lang, string> => ({
  ro: `Din (1) |xy| ≤ p, iar primele p simboluri ale lui w sunt toate <i>a</i>, rezultă că x și y conțin doar <i>a</i>. Deci x = ${a('s')}, y = ${a('k')}, z = ${a('p−s−k')}${zTail}, unde s ≥ 0, <b>k ≥ 1</b> (din (2) |y| ≥ 1) și <b>s + k ≤ p</b> (din (1)).`,
  en: `By (1) |xy| ≤ p, and since the first p symbols of w are all <i>a</i>'s, x and y consist only of <i>a</i>'s. So x = ${a('s')}, y = ${a('k')}, z = ${a('p−s−k')}${zTail}, where s ≥ 0, <b>k ≥ 1</b> (by (2) |y| ≥ 1) and <b>s + k ≤ p</b> (by (1)).`,
});

const pumpedAs = (tail: string): Record<Lang, string> => ({
  ro: `Atunci, pentru orice i ≥ 0: ${xyiz} = ${a('s')}·${a('k·i')}·${a('p−s−k')}${tail} = ${a('p+(i−1)k')}${tail}.`,
  en: `Then, for every i ≥ 0: ${xyiz} = ${a('s')}·${a('k·i')}·${a('p−s−k')}${tail} = ${a('p+(i−1)k')}${tail}.`,
});

function proofs(parts: {
  word: string;
  inL: Record<Lang, string>;
  split: Record<Lang, string>;
  pumped: Record<Lang, string>;
  contradiction: Record<Lang, string>;
}): Record<Lang, GeneralProof> {
  const one = (l: Lang): GeneralProof => ({
    word: parts.word,
    inL: parts.inL[l],
    split: parts.split[l],
    pumped: parts.pumped[l],
    contradiction: parts.contradiction[l],
  });
  return { ro: one('ro'), en: one('en') };
}

export const LANGUAGES: PumpingLanguage[] = [
  {
    id: 'anbn',
    label: `{ ${a('n')}${b('n')} | n ≥ 0 }`,
    inL: (w) => /^a*b*$/.test(w) && count(w, 'a') === count(w, 'b'),
    word: (p) => 'a'.repeat(p) + 'b'.repeat(p),
    wordLabel: (p) => `${a(p)}${b(p)}`,
    proof: proofs({
      word: `w = ${a('p')}${b('p')}`,
      inL: {
        ro: `w ∈ L (luăm n = p) și |w| = 2p ≥ p.`,
        en: `w ∈ L (take n = p) and |w| = 2p ≥ p.`,
      },
      split: splitInAs(b('p')),
      pumped: pumpedAs(b('p')),
      contradiction: {
        ro: `Alegem <b>i = 0</b>: ${xyiz} = ${a('p−k')}${b('p')}. Cum k ≥ 1, avem p − k &lt; p, deci numărul de <i>a</i> diferă de numărul de <i>b</i> ⇒ xy<sup>0</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 0</b>: ${xyiz} = ${a('p−k')}${b('p')}. Since k ≥ 1, p − k &lt; p, so the numbers of <i>a</i>'s and <i>b</i>'s differ ⇒ xy<sup>0</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'anbncn',
    label: `{ ${a('n')}${b('n')}${c('n')} | n ≥ 0 }`,
    inL: (w) => /^a*b*c*$/.test(w) && count(w, 'a') === count(w, 'b') && count(w, 'b') === count(w, 'c'),
    word: (p) => 'a'.repeat(p) + 'b'.repeat(p) + 'c'.repeat(p),
    wordLabel: (p) => `${a(p)}${b(p)}${c(p)}`,
    maxP: 6,
    proof: proofs({
      word: `w = ${a('p')}${b('p')}${c('p')}`,
      inL: {
        ro: `w ∈ L (n = p) și |w| = 3p ≥ p.`,
        en: `w ∈ L (n = p) and |w| = 3p ≥ p.`,
      },
      split: splitInAs(`${b('p')}${c('p')}`),
      pumped: pumpedAs(`${b('p')}${c('p')}`),
      contradiction: {
        ro: `Alegem <b>i = 2</b>: ${xyiz} = ${a('p+k')}${b('p')}${c('p')}. Cum k ≥ 1, p + k ≠ p, deci numărul de <i>a</i> diferă de cel de <i>b</i> ⇒ xy<sup>2</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 2</b>: ${xyiz} = ${a('p+k')}${b('p')}${c('p')}. Since k ≥ 1, p + k ≠ p, so the number of <i>a</i>'s differs from the number of <i>b</i>'s ⇒ xy<sup>2</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'anb2n',
    label: `{ ${a('n')}${b('2n')} | n ≥ 0 }`,
    inL: (w) => /^a*b*$/.test(w) && 2 * count(w, 'a') === count(w, 'b'),
    word: (p) => 'a'.repeat(p) + 'b'.repeat(2 * p),
    wordLabel: (p) => `${a(p)}${b(2 * p)}`,
    maxP: 6,
    proof: proofs({
      word: `w = ${a('p')}${b('2p')}`,
      inL: {
        ro: `w ∈ L (n = p) și |w| = 3p ≥ p.`,
        en: `w ∈ L (n = p) and |w| = 3p ≥ p.`,
      },
      split: splitInAs(b('2p')),
      pumped: pumpedAs(b('2p')),
      contradiction: {
        ro: `Alegem <b>i = 0</b>: ${xyiz} = ${a('p−k')}${b('2p')}. Ca acest cuvânt să fie în L ar trebui 2(p − k) = 2p, adică k = 0, imposibil deoarece k ≥ 1 ⇒ xy<sup>0</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 0</b>: ${xyiz} = ${a('p−k')}${b('2p')}. For this word to be in L we would need 2(p − k) = 2p, i.e. k = 0, impossible since k ≥ 1 ⇒ xy<sup>0</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'aibj',
    label: `{ ${a('i')}${b('j')} | 0 ≤ i &lt; j }`,
    inL: (w) => /^a*b*$/.test(w) && count(w, 'a') < count(w, 'b'),
    word: (p) => 'a'.repeat(p) + 'b'.repeat(p + 1),
    wordLabel: (p) => `${a(p)}${b(p + 1)}`,
    proof: proofs({
      word: `w = ${a('p')}${b('p+1')}`,
      inL: {
        ro: `w ∈ L deoarece p &lt; p + 1, și |w| = 2p + 1 ≥ p.`,
        en: `w ∈ L because p &lt; p + 1, and |w| = 2p + 1 ≥ p.`,
      },
      split: splitInAs(b('p+1')),
      pumped: pumpedAs(b('p+1')),
      contradiction: {
        ro: `Alegem <b>i = 2</b>: ${xyiz} = ${a('p+k')}${b('p+1')}. Cum k ≥ 1, p + k ≥ p + 1, deci numărul de <i>a</i> nu mai este strict mai mic decât cel de <i>b</i> ⇒ xy<sup>2</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 2</b>: ${xyiz} = ${a('p+k')}${b('p+1')}. Since k ≥ 1, p + k ≥ p + 1, so the number of <i>a</i>'s is no longer strictly smaller than the number of <i>b</i>'s ⇒ xy<sup>2</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'eqab',
    label: `{ w ∈ {a,b}* | |w|<sub>a</sub> = |w|<sub>b</sub> }`,
    inL: (w) => /^[ab]*$/.test(w) && count(w, 'a') === count(w, 'b'),
    word: (p) => 'a'.repeat(p) + 'b'.repeat(p),
    wordLabel: (p) => `${a(p)}${b(p)}`,
    proof: proofs({
      word: `w = ${a('p')}${b('p')}`,
      inL: {
        ro: `w are p de <i>a</i> și p de <i>b</i>, deci w ∈ L, și |w| = 2p ≥ p.`,
        en: `w has p <i>a</i>'s and p <i>b</i>'s, so w ∈ L, and |w| = 2p ≥ p.`,
      },
      split: splitInAs(b('p')),
      pumped: pumpedAs(b('p')),
      contradiction: {
        ro: `Alegem <b>i = 0</b>: ${xyiz} = ${a('p−k')}${b('p')} are p − k litere <i>a</i> și p litere <i>b</i>; cum k ≥ 1, p − k ≠ p ⇒ xy<sup>0</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 0</b>: ${xyiz} = ${a('p−k')}${b('p')} has p − k <i>a</i>'s and p <i>b</i>'s; since k ≥ 1, p − k ≠ p ⇒ xy<sup>0</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'pal',
    label: `{ w ∈ {a,b}* | w = w<sup>R</sup> }`,
    inL: (w) => /^[ab]*$/.test(w) && w === [...w].reverse().join(''),
    word: (p) => 'a'.repeat(p) + 'b' + 'a'.repeat(p),
    wordLabel: (p) => `${a(p)}b${a(p)}`,
    proof: proofs({
      word: `w = ${a('p')}b${a('p')}`,
      inL: {
        ro: `w se citește la fel în ambele sensuri, deci w ∈ L, și |w| = 2p + 1 ≥ p.`,
        en: `w reads the same both ways, so w ∈ L, and |w| = 2p + 1 ≥ p.`,
      },
      split: splitInAs(`b${a('p')}`),
      pumped: pumpedAs(`b${a('p')}`),
      contradiction: {
        ro: `Alegem <b>i = 0</b>: ${xyiz} = ${a('p−k')}b${a('p')}. Cuvântul are un singur <i>b</i>; ca să fie palindrom, <i>b</i> trebuie să fie exact la mijloc, adică p − k = p, deci k = 0. Imposibil, deoarece k ≥ 1 ⇒ xy<sup>0</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 0</b>: ${xyiz} = ${a('p−k')}b${a('p')}. The word has a single <i>b</i>; to be a palindrome, the <i>b</i> must be exactly in the middle, i.e. p − k = p, so k = 0. Impossible, since k ≥ 1 ⇒ xy<sup>0</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'ww',
    label: `{ ww | w ∈ {a,b}* }`,
    inL: (w) => /^[ab]*$/.test(w) && w.length % 2 === 0 && w.slice(0, w.length / 2) === w.slice(w.length / 2),
    word: (p) => 'a'.repeat(p) + 'b' + 'a'.repeat(p) + 'b',
    wordLabel: (p) => `${a(p)}b${a(p)}b`,
    proof: proofs({
      word: `w = ${a('p')}b${a('p')}b`,
      inL: {
        ro: `w = uu cu u = ${a('p')}b, deci w ∈ L, și |w| = 2p + 2 ≥ p.`,
        en: `w = uu with u = ${a('p')}b, so w ∈ L, and |w| = 2p + 2 ≥ p.`,
      },
      split: splitInAs(`b${a('p')}b`),
      pumped: pumpedAs(`b${a('p')}b`),
      contradiction: {
        ro: `Alegem <b>i = 0</b>: w' = ${a('p−k')}b${a('p')}b, cu |w'| = 2p + 2 − k. Dacă k este impar, |w'| este impar și w' ∉ L. Dacă k este par, presupunem w' = vv cu |v| = p + 1 − k/2. w' are exact doi <i>b</i>, deci fiecare jumătate conține unul; cum w' se termină în <i>b</i>, și v se termină în <i>b</i>, deci primul <i>b</i> din w' ar fi pe poziția p + 1 − k/2. Dar primul <i>b</i> este pe poziția p − k + 1, iar p − k + 1 = p + 1 − k/2 ⇒ k = 0, imposibil (k ≥ 1). Deci xy<sup>0</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 0</b>: w' = ${a('p−k')}b${a('p')}b, with |w'| = 2p + 2 − k. If k is odd, |w'| is odd and w' ∉ L. If k is even, suppose w' = vv with |v| = p + 1 − k/2. w' has exactly two <i>b</i>'s, so each half contains one; since w' ends in <i>b</i>, v ends in <i>b</i> too, so the first <i>b</i> of w' would be at position p + 1 − k/2. But the first <i>b</i> is at position p − k + 1, and p − k + 1 = p + 1 − k/2 ⇒ k = 0, impossible (k ≥ 1). So xy<sup>0</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'square',
    label: `{ ${a('n²')} | n ≥ 0 }`,
    inL: (w) => /^a*$/.test(w) && Number.isInteger(Math.sqrt(w.length)),
    word: (p) => 'a'.repeat(p * p),
    wordLabel: (p) => a(p * p),
    maxP: 6,
    proof: proofs({
      word: `w = ${a('p²')}`,
      inL: {
        ro: `w ∈ L (n = p) și |w| = p² ≥ p.`,
        en: `w ∈ L (n = p) and |w| = p² ≥ p.`,
      },
      split: {
        ro: `w conține doar <i>a</i>, deci y = ${a('k')}. Din (2) |y| ≥ 1 avem <b>k ≥ 1</b>, iar din (1) |y| ≤ |xy| ≤ p avem <b>k ≤ p</b>.`,
        en: `w contains only <i>a</i>'s, so y = ${a('k')}. By (2) |y| ≥ 1 we have <b>k ≥ 1</b>, and by (1) |y| ≤ |xy| ≤ p we have <b>k ≤ p</b>.`,
      },
      pumped: {
        ro: `Atunci, pentru orice i ≥ 0: |${xyiz}| = p² + (i − 1)k.`,
        en: `Then, for every i ≥ 0: |${xyiz}| = p² + (i − 1)k.`,
      },
      contradiction: {
        ro: `Alegem <b>i = 2</b>: |xy<sup>2</sup>z| = p² + k. Din 1 ≤ k ≤ p: p² &lt; p² + k ≤ p² + p &lt; p² + 2p + 1 = (p + 1)². Deci p² + k este strict între două pătrate perfecte consecutive, deci nu este pătrat perfect ⇒ xy<sup>2</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = 2</b>: |xy<sup>2</sup>z| = p² + k. Since 1 ≤ k ≤ p: p² &lt; p² + k ≤ p² + p &lt; p² + 2p + 1 = (p + 1)². So p² + k lies strictly between two consecutive perfect squares and is not a perfect square ⇒ xy<sup>2</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
  {
    id: 'prime',
    label: `{ ${a('n')} | n prim / n prime }`,
    inL: (w) => /^a*$/.test(w) && isPrime(w.length),
    word: (p) => 'a'.repeat(nextPrime(p)),
    wordLabel: (p) => a(nextPrime(p)),
    proof: proofs({
      word: `w = ${a('n')}, n prim, n ≥ p`,
      inL: {
        ro: `Un astfel de n există, deoarece mulțimea numerelor prime este infinită. Atunci w ∈ L și |w| = n ≥ p.`,
        en: `Such an n exists because there are infinitely many primes. Then w ∈ L and |w| = n ≥ p.`,
      },
      split: {
        ro: `w conține doar <i>a</i>, deci y = ${a('k')}, cu <b>k ≥ 1</b> din (2) |y| ≥ 1 (și k ≤ p din (1)).`,
        en: `w contains only <i>a</i>'s, so y = ${a('k')}, with <b>k ≥ 1</b> by (2) |y| ≥ 1 (and k ≤ p by (1)).`,
      },
      pumped: {
        ro: `Atunci, pentru orice i ≥ 0: |${xyiz}| = n + (i − 1)k.`,
        en: `Then, for every i ≥ 0: |${xyiz}| = n + (i − 1)k.`,
      },
      contradiction: {
        ro: `Alegem <b>i = n + 1</b>: |${xyiz}| = n + nk = n(1 + k). Cum n ≥ 2 (prim) și 1 + k ≥ 2 (k ≥ 1), n(1 + k) este produsul a doi factori ≥ 2, deci nu este prim ⇒ xy<sup>n+1</sup>z ∉ L, contradicție cu (3).`,
        en: `Choose <b>i = n + 1</b>: |${xyiz}| = n + nk = n(1 + k). Since n ≥ 2 (prime) and 1 + k ≥ 2 (k ≥ 1), n(1 + k) is a product of two factors ≥ 2, so it is not prime ⇒ xy<sup>n+1</sup>z ∉ L, contradicting (3).`,
      },
    }),
  },
];
