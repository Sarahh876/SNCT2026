/* ============================================================
   A Jornada de Ada Lovelace — som (música + efeitos)
   Música: arquivos em /audio (se faltar algum, o jogo segue sem ele).
   Efeitos (acerto, erro, pista, captura, vitória do monstro): sintetizados
   aqui mesmo com Web Audio, então funcionam sem nenhum arquivo.
   ============================================================ */
(function () {
  const ARQUIVOS = {
    menu: 'audio/menu.mp3',           // tela inicial
    fase0: 'audio/fase1.mp3',         // fase 1 – infância e educação
    fase1: 'audio/fase2.mp3',         // fase 2 – Babbage e as engrenagens
    fase2: 'audio/fase3.mp3',         // fase 3 – Nota G e legado
    desafio: 'audio/desafio.mp3',     // enquanto responde a pergunta
    perseguicao: 'audio/perseguicao.mp3', // entra por cima quando o monstro se aproxima
    vitoria: 'audio/vitoria.mp3',     // tela final
    fundo: 'audio/fundo.mp3'          // MÚSICA DO JOGO TODO (toca em todas as telas, sem recomeçar)
  };
  const VOLUME_MUSICA = 1.0;          // volume geral da música (0 a 1)
  const VOLUME_EFEITOS = 1.8;         // multiplicador do volume dos efeitos (1 = original)
  const DIST_MAX = 600, DIST_MIN = 200; // distância do monstro: longe = calmo, perto = intenso
  const CHAVE = 'jornada-ada-som';
  const USAR_CAIXINHA = false;        // true = a caixinha de música embutida volta a tocar junto com a música do jogo

  let ligado = true, liberado = false, ctx = null;
  try { ligado = localStorage.getItem(CHAVE) !== 'off'; } catch (e) {}

  const faixas = {};
  for (const [nome, src] of Object.entries(ARQUIVOS)) {
    const a = new Audio(); a.src = src; a.loop = true; a.preload = 'auto'; a.volume = 0;
    faixas[nome] = { a, vol: 0, alvo: 0, ok: true };
    a.addEventListener('error', () => { faixas[nome].ok = false; });
  }

  function liberar() {
    if (liberado) return; liberado = true;
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.resume) ctx.resume(); montarBarramento(); } catch (e) { ctx = null; }
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, liberar, { passive: true }));

  /* ---------- efeitos sintetizados ---------- */
  function nota(freq, ini, dur, tipo, vol) {
    if (!ctx || !ligado) return;
    const t = ctx.currentTime + ini, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || 'triangle'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.min(0.9, (vol || 0.2) * VOLUME_EFEITOS), t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.05);
  }
  const EFEITOS = {
    pista:   () => { nota(784, 0, 0.35, 'sine', 0.2); nota(1175, 0.08, 0.45, 'sine', 0.14); },
    acerto:  () => { [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.3, 'triangle', 0.2)); },
    erro:    () => { nota(220, 0, 0.25, 'sawtooth', 0.08); nota(165, 0.15, 0.35, 'sawtooth', 0.08); },
    captura: () => { [392, 330, 262, 196].forEach((f, i) => nota(f, i * 0.16, 0.4, 'triangle', 0.2)); },
    vidaMonstro: () => { nota(988, 0, 0.2, 'square', 0.07); nota(1319, 0.1, 0.3, 'square', 0.07); },
    derrota: () => { [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => nota(f, i * 0.12, 0.4, 'triangle', 0.22)); },
    porta:   () => { [440, 554, 659].forEach((f, i) => nota(f, i * 0.1, 0.5, 'sine', 0.16)); }
  };

  /* ---------- música de fundo embutida (caixinha de música, composição original) ----------
     Toca sozinha quando o arquivo .mp3 daquela tela não existe. Se você colocar o .mp3
     na pasta /audio, o arquivo passa a tocar no lugar. */
  let barramento = null;
  function montarBarramento() {
    barramento = ctx.createGain(); barramento.gain.value = 0;
    const eco = ctx.createDelay(1), fb = ctx.createGain(), molhado = ctx.createGain();
    eco.delayTime.value = 0.34; fb.gain.value = 0.32; molhado.gain.value = 0.4;
    barramento.connect(ctx.destination); barramento.connect(eco); eco.connect(fb); fb.connect(eco); eco.connect(molhado); molhado.connect(ctx.destination);
  }
  const mi = (m) => 440 * Math.pow(2, (m - 69) / 12);
  // acordes (semitons em relação ao lá 4 = MIDI 69)
  const MENOR = [[0, 3, 7], [-4, 0, 3], [3, 7, 10], [-2, 2, 5]];   // Lám – Fá – Dó – Sol
  const MAIOR = [[3, 7, 10], [-2, 2, 5], [0, 3, 7], [-4, 0, 3]];   // Dó – Sol – Lám – Fá
  // melodia: [passo (colcheia) dentro dos 4 compassos, semitom, duração em passos]
  const MEL_MENOR = [[0, 7, 2], [2, 12, 2], [4, 10, 2], [6, 7, 2], [8, 12, 2], [10, 8, 2], [12, 12, 4],
    [16, 15, 2], [18, 12, 2], [20, 7, 2], [22, 12, 2], [24, 14, 2], [26, 10, 2], [28, 5, 4]];
  const MEL_MAIOR = [[0, 7, 2], [2, 10, 2], [4, 15, 2], [6, 10, 2], [8, 17, 2], [10, 14, 2], [12, 10, 2], [14, 14, 2],
    [16, 15, 2], [18, 12, 2], [20, 7, 2], [22, 12, 2], [24, 12, 2], [26, 15, 2], [28, 8, 4]];
  const ARP = [0, 1, 2, 3, 2, 1, 2, 1];
  // por tela: andamento (bpm), tom (semitons acima do original) e se é a versão alegre
  const CENAS = {
    menu:    { bpm: 72, tom: 0 },
    fase0:   { bpm: 84, tom: 0 },
    fase1:   { bpm: 92, tom: 5 },
    fase2:   { bpm: 84, tom: 7 },
    desafio: { bpm: 66, tom: 0 },
    vitoria: { bpm: 100, tom: 0, maior: true }
  };
  const sint = { vol: 0, alvo: 0, cena: 'menu', intensidade: 0, passo: 0, proximo: 0 };

  function sino(f, t, dur, vol) {
    for (const [mult, v] of [[1, 1], [2, 0.28]]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = f * mult;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * v, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(barramento); o.start(t); o.stop(t + dur + 0.05);
    }
  }
  function grave(f, t, dur, vol, tipo) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(barramento); o.start(t); o.stop(t + dur + 0.05);
  }
  function agendarPasso(t, passo, c, durPasso) {
    const maior = !!c.maior, prog = maior ? MAIOR : MENOR, mel = maior ? MEL_MAIOR : MEL_MENOR;
    const p = passo % 32, compasso = Math.floor(p / 8), noCompasso = p % 8, acorde = prog[compasso];
    const tom = c.tom, i = sint.intensidade;
    if (!sint.soPulso) {
    // arpejo (caixinha de música)
    const tons = [acorde[0], acorde[1], acorde[2], acorde[0] + 12];
    sino(mi(57 + tom + tons[ARP[noCompasso]]), t, durPasso * 3.2, 0.11);
    // melodia
    for (const [ps, st, len] of mel) if (ps === p) sino(mi(69 + tom + st), t, durPasso * len * 1.5, 0.15);
    // baixo nos tempos fortes
    if (noCompasso === 0 || noCompasso === 4) grave(mi(45 + tom + acorde[0]), t, durPasso * 4, 0.16, 'sine');
    }
    // quando o monstro chega perto: pulso grave e tique-taque
    if (i > 0.02) {
      grave(mi(33 + tom + acorde[0]), t, durPasso * 0.9, 0.2 * i, 'triangle');
      if (noCompasso % 2 === 1) grave(2400, t, 0.03, 0.05 * i, 'square');
    }
  }
  function tocarSintese() {
    if (!ctx || !barramento) return;
    const c = CENAS[sint.cena] || CENAS.fase0;
    const agora = ctx.currentTime;
    if (sint.proximo < agora) sint.proximo = agora + 0.05;
    while (sint.proximo < agora + 0.15) {
      const bpm = c.bpm * (1 + 0.45 * sint.intensidade), durPasso = 60 / bpm / 2;
      agendarPasso(sint.proximo, sint.passo, c, durPasso);
      sint.proximo += durPasso; sint.passo++;
    }
  }
  setInterval(() => { if (sint.alvo > 0 && ligado && ctx) tocarSintese(); }, 30);

  /* ---------- música: cada quadro, ajusta volumes com suavidade ---------- */
  function atualizar(dt, s) {
    // s = { cena, fase, modal, capturada, intensidade (0 a 1) }
    for (const f of Object.values(faixas)) f.alvo = 0;
    const m = VOLUME_MUSICA;
    let chave = null, alvoCena = 0;
    const i = s.intensidade || 0, k = s.capturada ? 0.3 : 1;
    if (s.cena === 'tela-inicial') { chave = 'menu'; alvoCena = m; }
    else if (s.cena === 'vitoria') { chave = 'vitoria'; alvoCena = m; }
    else if (s.cena === 'jogo') {
      if (s.modal) { chave = 'desafio'; alvoCena = m * 0.8; }
      else {
        chave = 'fase' + s.fase; alvoCena = m * (1 - 0.65 * i) * k;
        faixas.perseguicao.alvo = m * 0.9 * i * k;
      }
    }
    // música da tela (se você colocou um arquivo próprio) > música do jogo todo (fundo.mp3) > trilha embutida
    const propria = chave && faixas[chave] && faixas[chave].ok;
    const temFundo = faixas.fundo.ok;
    if (propria) faixas[chave].alvo = alvoCena;
    else if (chave && temFundo) faixas.fundo.alvo = alvoCena;
    const semArquivo = chave && !propria && !temFundo;
    // trilha embutida: sozinha só se não houver nenhum arquivo; com o fundo.mp3 ela fica só como reforço de perseguição
    const reforco = chave && !propria && temFundo && !USAR_CAIXINHA && !faixas.perseguicao.ok && !s.modal && i > 0.02;
    if (semArquivo || (chave && !propria && temFundo && USAR_CAIXINHA) || reforco) {
      if (chave !== sint.cena) sint.cena = chave;
      sint.soPulso = !!reforco;
      sint.intensidade = faixas.perseguicao.ok ? 0 : (s.modal ? 0 : i);
      sint.alvo = m * 0.9 * k;
    } else { sint.alvo = 0; sint.intensidade = 0; }
    const alvoS = ligado ? sint.alvo : 0;
    sint.vol += (alvoS - sint.vol) * Math.min(1, dt * 2.5);
    if (Math.abs(alvoS - sint.vol) < 0.003) sint.vol = alvoS;
    if (barramento) barramento.gain.value = sint.vol;

    for (const f of Object.values(faixas)) {
      if (!f.ok) continue;
      const alvo = ligado ? f.alvo : 0;
      f.vol += Math.max(-1, Math.min(1, (alvo - f.vol) * Math.min(1, dt * 2.5)));
      if (Math.abs(alvo - f.vol) < 0.005) f.vol = alvo;
      f.a.volume = Math.max(0, Math.min(1, f.vol));
      if (liberado && alvo > 0 && f.a.paused) { const p = f.a.play(); if (p && p.catch) p.catch(() => {}); }
      else if (f.vol === 0 && alvo === 0 && !f.a.paused) f.a.pause();
    }
  }

  function alternar() {
    ligado = !ligado;
    try { localStorage.setItem(CHAVE, ligado ? 'on' : 'off'); } catch (e) {}
    return ligado;
  }
  window.Som = { atualizar, efeito: (n) => { liberar(); if (EFEITOS[n]) EFEITOS[n](); }, alternar, get ligado() { return ligado; } };
})();
