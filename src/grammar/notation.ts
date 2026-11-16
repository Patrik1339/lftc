/** One worked example on the BNF & EBNF page: the same syntax written three ways. */
export interface NotationExample {
  /** i18n key prefix: `${key}.title`, `${key}.note`. */
  key: string;
  bnf: string;
  ebnf: string;
  /** The equivalent grammar in the app's text format (single-character terminals), if it fits. */
  grammar?: string;
  /** Words of the language, and words outside it. */
  yes: string[];
  no: string[];
}

export const NOTATION_EXAMPLES: NotationExample[] = [
  {
    key: 'bnf.ex.digits',
    bnf: `<number> ::= <digit> | <digit> <number>
<digit>  ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"`,
    ebnf: `number = digit , { digit } ;
digit  = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;`,
    grammar: `N -> DN | D
D -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`,
    yes: ['7', '42', '2026'],
    no: ['ε', '4a', '-3'],
  },
  {
    key: 'bnf.ex.signed',
    bnf: `<integer> ::= <sign> <number> | <number>
<sign>    ::= "+" | "-"`,
    ebnf: `integer = [ "+" | "-" ] , digit , { digit } ;`,
    grammar: `I -> GN | N
G -> + | -
N -> DN | D
D -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`,
    yes: ['12', '+12', '-5'],
    no: ['+', '+-1', '1-'],
  },
  {
    key: 'bnf.ex.ident',
    bnf: `<id>     ::= <letter> | <id> <letter> | <id> <digit>
<letter> ::= "a" | "b" | … | "z"
<digit>  ::= "0" | "1" | … | "9"`,
    ebnf: `id = letter , { letter | digit } ;`,
    grammar: `# letters reduced to a, b, x and digits to 0, 1
I -> L | IL | ID
L -> a | b | x
D -> 0 | 1`,
    yes: ['x', 'ab1', 'x10b'],
    no: ['1x', 'ε', 'a_b'],
  },
  {
    key: 'bnf.ex.list',
    bnf: `<list> ::= "(" ")" | "(" <items> ")"
<items> ::= <id> | <id> "," <items>`,
    ebnf: `list = "(" , [ id , { "," , id } ] , ")" ;`,
    grammar: `# i stands for an identifier
L -> () | (M)
M -> i | i,M`,
    yes: ['()', '(i)', '(i,i,i)'],
    no: ['(i,)', '(,i)', 'i,i'],
  },
  {
    key: 'bnf.ex.expr',
    bnf: `<expr>   ::= <expr> "+" <term> | <expr> "-" <term> | <term>
<term>   ::= <term> "*" <factor> | <term> "/" <factor> | <factor>
<factor> ::= "(" <expr> ")" | <id>`,
    ebnf: `expr   = term , { ( "+" | "-" ) , term } ;
term   = factor , { ( "*" | "/" ) , factor } ;
factor = "(" , expr , ")" | id ;`,
    grammar: `# a stands for an identifier
E -> E+T | E-T | T
T -> T*F | T/F | F
F -> (E) | a`,
    yes: ['a', 'a+a*a', '(a-a)/a'],
    no: ['a+', '(a', 'a**a'],
  },
  {
    key: 'bnf.ex.if',
    bnf: `<stmt> ::= <if> | <assign>
<if>   ::= "if" <cond> "then" <stmt>
         | "if" <cond> "then" <stmt> "else" <stmt>`,
    ebnf: `stmt = if | assign ;
if   = "if" , cond , "then" , stmt , [ "else" , stmt ] ;`,
    yes: ['if c then x:=1', 'if c then x:=1 else x:=2'],
    no: ['if c x:=1', 'else x:=2'],
  },
];

/** EBNF constructs and how each becomes plain BNF with a new nonterminal <N>. */
export const EBNF_RULES: { ebnf: string; bnf: string; key: string }[] = [
  { key: 'bnf.rule.opt', ebnf: 'A = α , [ β ] , γ ;', bnf: '<A> ::= α <N> γ\n<N> ::= β | ε' },
  { key: 'bnf.rule.rep', ebnf: 'A = α , { β } , γ ;', bnf: '<A> ::= α <N> γ\n<N> ::= ε | β <N>' },
  { key: 'bnf.rule.group', ebnf: 'A = α , ( β | γ ) , δ ;', bnf: '<A> ::= α <N> δ\n<N> ::= β | γ' },
  { key: 'bnf.rule.plus', ebnf: 'A = α , β , { β } ;   (β+)', bnf: '<A> ::= α <N>\n<N> ::= β | β <N>' },
];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Light syntax colouring for BNF/EBNF text: <nonterminals>, "terminals" and metasymbols. */
export function notationHtml(src: string): string {
  return src
    .split(/("[^"]*"|<[^<>\s][^<>]*>|::=|[|[\]{}();,=]|ε)/)
    .map((part, i) => {
      if (i % 2 === 0) return esc(part);
      if (part.startsWith('"')) return `<span class="bnf-t">${esc(part)}</span>`;
      if (part.startsWith('<')) return `<span class="bnf-nt">${esc(part)}</span>`;
      if (part === 'ε') return part;
      return `<span class="bnf-meta">${esc(part)}</span>`;
    })
    .join('');
}
