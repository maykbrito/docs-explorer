# JavaScript
Primeiros passos

---
## Sintaxe

É presente em toda linguagem e é importante para a comunicação

```js
const mensagem = "Bom te ver aqui! "

alert(mensagem + (10 * 100) + " abraços")

// Bom te ver aqui! 1000 abraços
```

---
## Executando JavaScript

- De maneira imediata
  
  → No Browser a partir da ferramenta `DevTools` apertando o atalho `F12` no seu teclado

  → Plataformas online (codepen.io, fronteditor.dev)

- Arquivos no computador (exemplo abaixo)

```html
<!-- em um arquvio index.html -->

<!-- executa o javascript direto no .html -->
<script> alert('Olá!')</script>

<!-- importa um arquivo .js no seu .html -->
<script src="./script.js"></script>
```

---
## Comentários

Servem para ignorar uma ou mais linhas de código

```js
// Comentário de uma linha 

/*
 Comentário de bloco ou multi-linha
*/
```