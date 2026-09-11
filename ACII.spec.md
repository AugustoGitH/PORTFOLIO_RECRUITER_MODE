Temos duas imagens usadas na página:
 <img className="object-cover" src="src/assets/profile/augusto_main_profile.png" alt="Augusto Caetano Westphal" width={280} />
         <img src="/src/assets/profile/augusto_congrulations_02.png" width={350} />

quero caracterizar essas imagens em formatdo de caracteres estilo bloco de comando, os caracteres vão ser agregar e formar as imagens da referencia, ambas precisam ser componentizadas e com o mecanismo que vai ser usado centralizado, as cores dos caracteres devem ser ud-neutral-999 e ud-auxiliary-purple

---

## Fonte dinâmica no modo recrutador

### Objetivo

No modo padrão, a ilustração principal usa `augusto_main_profile.png`. Ao ativar o modo
recrutador, ela muda para `augusto_main_profile-recruiter.png`, cuja pose aponta para a ação
de currículo. A mudança precisa ocorrer como uma transformação ASCII, não como uma substituição
estática de imagem.

### Contrato

`AsciiArt` aceita `rows?: number` além de `src`, `width` e `columns`. Quando `rows` é definido,
a grade e o bloco visual mantêm a mesma altura para qualquer fonte. O About fixa a arte em
`width={300}`, `columns={110}` e `rows={78}`.

### Base de layout e overflow de slides

O tamanho visual da arte é independente do espaço que ela reserva no layout. `baseWidth` define
a largura da primeira imagem e do slot que os elementos vizinhos enxergam; `width` define a
largura da arte renderizada. Quando `width > baseWidth`, o excesso é posicionado absolutamente
dentro do slot e não comprime texto, botões ou outras colunas.

Por padrão, `overflowAlign="right"` mantém a borda direita da imagem-base fixa. Em uma ilustração
à direita do texto, portanto, o excesso cresce para a esquerda e pode passar visualmente sobre o
conteúdo. A arte usa `pointer-events: none`, para que um botão coberto visualmente continue
clicável. Slides podem usar `left` ou `center` quando a composição exigir outro ponto de ancoragem.

`baseRows` aplica a mesma regra à altura: o slot mantém as linhas da imagem original, enquanto um
slide panorâmico pode usar menos linhas e maior largura sem deslocar as seções abaixo.

### Comportamento

1. A arte atual permanece visível enquanto a próxima imagem é carregada e convertida.
2. Quando a nova grade estiver pronta, cada célula percorre a rampa de densidade ASCII até o
   caractere, tom e espaço final da nova fonte.
3. A transformação segue a onda de baixo para cima já usada pela revelação inicial.
4. Ao sair do modo recrutador, o mesmo processo ocorre no sentido inverso.
5. Após o morph, o shimmer ocioso continua usando a grade nova.
6. Quando um slide troca largura ou quantidade de linhas, a mesma grade faz morph enquanto
   largura, altura e tamanho dos glifos interpolam para a geometria final. A nova arte não é
   revelada novamente nem sobreposta como uma segunda camada.

### Estados do currículo no modo recrutador

1. Sem interação, usa `augusto_main_profile-recruiter.png` (`300px`, `78` linhas).
2. O hover/foco no botão de currículo não altera a ilustração por enquanto.
3. Após um download bem-sucedido, usa `augusto_main_profile.png`, sem apontamento, até a página
   ser recarregada.

### Acessibilidade e desempenho

- Com `prefers-reduced-motion`, a grade troca diretamente após o carregamento.
- A transição reutiliza as linhas e runs existentes; não usa um elemento por caractere.
- O `pre` mantém largura e altura constantes durante carregamento, morph e retorno ao modo
  padrão, sem layout shift.

### Critérios de aceite

- Alternar o modo recrutador não altera a área de `300px × ~355px` ocupada pela ilustração.
- Um slide com `width` maior que `baseWidth` não reduz a área disponível ao conteúdo adjacente.
- A nova arte nunca aparece antes de estar decodificada.
- Não há frame em branco entre as duas fontes.
- A troca respeita redução de movimento do sistema.
