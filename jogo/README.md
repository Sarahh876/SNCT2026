# A Jornada de Ada Lovelace
Jogo educativo 2D em HTML, CSS e JavaScript puro. Abra `index.html` no navegador (precisa de internet apenas para a fonte do Google Fonts; sem ela, usa fontes padrão).

- `index.html` – estrutura das telas (início, jogo, janelas, vitória)
- `css/style.css` – visual (roxo, dourado, bege, vinho)
- `js/script.js` – dados das 3 fases, movimento, perseguição do monstro, perguntas, pontuação e salvamento (localStorage)
- `imagens/` – imagens do site de referência e a skyline de Londres

Controles: setas ou WASD (joystick no celular). Pontuação: 100 por acerto de primeira, 50 após errar.


## Monstro da Matemática
- O monstro aparece nos cenários e persegue Ada enquanto ela explora.
- Ele começa com 10 vidas (uma por pergunta do jogo).
- Cada pergunta concluída corretamente remove uma vida do monstro.
- Respostas incorretas permitem tentar novamente e não removem vida.
- Ao perder todas as vidas, o monstro é derrotado e deixa de perseguir Ada.
- O monstro não causa dano à personagem; a perseguição é uma mecânica de pressão e diversão.

## Som e música
- `js/audio.js` cuida de toda a parte sonora; a música fica em `audio/` (veja `audio/LEIA-ME.txt` com os nomes dos arquivos e sugestões).
- Uma música por tela (menu, fases 1–3, perguntas, vitória) e uma faixa de perseguição que fica mais forte quando o monstro se aproxima.
- Os efeitos (pista, acerto, erro, captura, monstro derrotado) são gerados pelo código; o botão 🔊 no canto liga/desliga tudo.

- Música de fundo embutida: sem nenhum .mp3, o jogo toca uma trilha de caixinha de música gerada pelo código (muda de tom/andamento por fase e acelera quando o monstro chega perto). Um .mp3 em `audio/` substitui a trilha daquela tela.
- `audio/menu.mp3` (música do vídeo enviado) toca na tela inicial; as demais telas mantêm a trilha embutida.
- `audio/fundo.mp3` (música do vídeo enviado) é a música do jogo todo. Prioridade por tela: .mp3 próprio → fundo.mp3 → caixinha embutida. A caixinha só toca junto se `USAR_CAIXINHA = true` em `js/audio.js`; o pulso de perseguição sempre entra quando o monstro chega perto.
- `audio/fundo.mp3` agora é a música de 2:50 (Mysterious Victorian Adventure); o fim e o começo foram misturados (crossfade de 8 s) para o loop não ser percebido.
