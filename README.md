# Ada Lovelace — Uma mente à frente do tempo

Site educativo e responsivo sobre Ada Lovelace, matemática e pioneira da programação. O projeto combina uma identidade visual delicada em tons de lilás e lavanda com informações biográficas, linha do tempo, legado, galeria e curiosidades.

## Preview

Adicione uma captura de tela do site em `imagens/preview.png` e atualize o caminho abaixo:

![Prévia do site](imagens/preview.png)

## Tecnologias

- HTML5 semântico
- Bootstrap 5.3.3
- CSS3 personalizado
- JavaScript puro
- Google Fonts: Cormorant Garamond e Poppins

## Estrutura

```text
ada-lovelace-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── imagens/
│   ├── ada-1.jpg
│   ├── ada-2.jpg
│   ├── ada-3.jpg
│   ├── ada-4.jpg
│   └── preview.png
├── README.md
├── .gitignore
└── LICENSE
```

As imagens `ada-1.jpg` a `ada-4.jpg` são espaços reservados. Substitua os `src` indicados nos comentários do HTML por arquivos locais ou imagens com licença adequada. O site começa com placeholders remotos para facilitar a visualização.

## Como executar localmente

1. Baixe ou clone o repositório.
2. Abra `index.html` diretamente no navegador; ou
3. Abra a pasta no VS Code e use a extensão **Live Server**.

O Bootstrap e as fontes são carregados por CDN, então é necessária conexão com a internet para esses recursos.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub chamado `ada-lovelace-site`.
2. No terminal, dentro da pasta do projeto, execute:

   ```bash
   git init
   git add .
   git commit -m "primeiro commit"
   git branch -M main
   git remote add origin https://github.com/USUARIO/ada-lovelace-site.git
   git push -u origin main
   ```

3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **Deploy from a branch**.
5. Escolha a branch `main` e a pasta `/ (root)`, depois clique em **Save**.
6. Após a publicação, acesse `https://USUARIO.github.io/ada-lovelace-site/`.

Troque `USUARIO` pelo seu nome de usuário do GitHub. A publicação pode levar alguns minutos.

## Personalização

- Textos: edite diretamente as seções em `index.html`.
- Cores, fontes, espaçamento e animações: altere `css/style.css`.
- Comportamentos: altere `js/script.js`.
- Imagens: substitua os placeholders comentados no HTML por arquivos dentro de `imagens/`.

## Créditos e fontes

Conteúdo histórico resumido a partir de referências gerais sobre Ada Lovelace, Charles Babbage e a Máquina Analítica. Para aprofundamento, consulte:

- [Ada Lovelace — Encyclopaedia Britannica](https://www.britannica.com/biography/Ada-Lovelace)
- [Ada Lovelace — Computer History Museum](https://www.computerhistory.org/babbage/adalovelace/)
- [Ada Lovelace — Science Museum](https://www.sciencemuseum.org.uk/objects-and-stories/ada-lovelace)

As imagens de placeholder são de `placehold.co`. Antes de publicar imagens reais, verifique licença, autoria e atribuição necessárias.

## Novidades da versão 2

Modo claro/escuro (salvo no `localStorage`), barra de progresso de leitura, menu com destaque da seção atual (scrollspy), seção de pessoas, linha do tempo gerada por JS, Nota G interativa (números de Bernoulli), citações rotativas, quiz e mais curiosidades.

## Versão 3

Novas fontes (Playfair Display, Pinyon Script, Nunito Sans), paleta roxa com toques dourados, ornamentos, símbolos flutuantes, números animados e novos marcos na linha do tempo e no quiz.
