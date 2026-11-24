/* Interações do site — JavaScript puro (ES6+) */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduzMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

const EVENTOS = [
  { ano: 1815, titulo: "O começo", texto: "Ada nasce em Londres, em 10 de dezembro, filha do poeta Lord Byron e de Annabella Milbanke." },
  { ano: 1816, titulo: "Um pai distante", texto: "Os pais se separam e Byron deixa a Inglaterra. Ada nunca chega a conhecê-lo; ele morre na Grécia, em 1824." },
  { ano: 1828, titulo: "Sonhos de voar", texto: "Aos 12 anos, estuda a anatomia dos pássaros e planeja asas mecânicas em um projeto que chama de “Flyology”." },
  { ano: 1833, titulo: "Um encontro decisivo", texto: "Aos 17 anos, apresentada por Mary Somerville, conhece Charles Babbage e se encanta por suas máquinas de cálculo." },
  { ano: 1835, titulo: "Condessa de Lovelace", texto: "Casa-se com William King. Em 1838 ele recebe o título de conde de Lovelace, e ela passa a ser condessa." },
  { ano: 1843, titulo: "As notas publicadas", texto: "Publica a tradução de um artigo de Luigi Menabrea sobre a Máquina Analítica, com notas bem maiores que o texto original. Na Nota G, descreve um algoritmo para números de Bernoulli." },
  { ano: 1852, titulo: "Um adeus precoce", texto: "Ada morre em 27 de novembro, aos 36 anos, após uma longa doença, e é sepultada ao lado do pai." },
  { ano: 1980, titulo: "Uma linguagem com seu nome", texto: "O Departamento de Defesa dos EUA batiza a linguagem Ada em sua homenagem. O padrão recebe o número 1815, ano de seu nascimento." },
  { ano: 2009, titulo: "O Dia de Ada Lovelace", texto: "Nasce a celebração anual, na segunda terça-feira de outubro, que destaca as conquistas de mulheres na ciência e na tecnologia." },
];
const CITACOES = [
  { texto: "A imaginação é a faculdade da descoberta.", fonte: "— Ada Lovelace, carta de 1841 (tradução livre)" },
  { texto: "A Máquina Analítica tece padrões algébricos, assim como o tear de Jacquard tece flores e folhas.", fonte: "— Ada Lovelace, Notas de 1843 (tradução livre)" },
];
const PERGUNTAS = [
  { q: "Em que cidade Ada nasceu?", o: ["Paris", "Londres", "Edimburgo", "Roma"], c: 1, e: "Ada nasceu em Londres, em 1815." },
  { q: "Com quem Ada colaborou intelectualmente?", o: ["Charles Darwin", "Isaac Newton", "Charles Babbage", "Alan Turing"], c: 2, e: "Babbage idealizou a Máquina Analítica." },
  { q: "Qual poeta era pai de Ada?", o: ["Lord Byron", "John Keats", "Percy Shelley", "William Wordsworth"], c: 0, e: "Lord Byron, que ela nunca chegou a conhecer." },
  { q: "Que tipo de números o algoritmo da Nota G calculava?", o: ["Primos", "Fibonacci", "Bernoulli", "Perfeitos"], c: 2, e: "A Nota G descreve o cálculo de números de Bernoulli." },
  { q: "Que linguagem de programação leva o nome de Ada?", o: ["Pascal", "Ada", "Lisp", "Python"], c: 1, e: "A linguagem Ada foi batizada em sua homenagem." },
  { q: "Que projeto Ada planejou aos 12 anos?", o: ["Um relógio", "Asas mecânicas para voar", "Um telescópio", "Um barco a vapor"], c: 1, e: "Em 1828 ela estudou pássaros e planejou uma máquina de voar, a “Flyology”." },
  { q: "Que número recebeu o padrão da linguagem Ada, igual ao seu ano de nascimento?", o: ["1815", "1843", "1852", "1980"], c: 0, e: "O padrão MIL-STD-1815 homenageia o ano em que Ada nasceu." },
];

document.addEventListener("DOMContentLoaded", () => {
  ativarTema();
  fecharMenuAoNavegar();
  renderTimeline();
  ativarFadeIn();
  controlarScroll();
  animarContador();
  girarCitacoes();
  iniciarBernoulli();
  iniciarQuiz();
  $("#currentYear").textContent = new Date().getFullYear();
});

function aplicarTema(t) {
  document.documentElement.dataset.tema = t;
  document.documentElement.dataset.bsTheme = t === "escuro" ? "dark" : "light";
  $("#temaToggle").setAttribute("aria-pressed", t === "escuro");
}
function ativarTema() {
  const atual = () => document.documentElement.dataset.tema || (matchMedia("(prefers-color-scheme: dark)").matches ? "escuro" : "claro");
  aplicarTema(atual());
  $("#temaToggle").addEventListener("click", () => {
    const novo = atual() === "escuro" ? "claro" : "escuro";
    aplicarTema(novo);
    try { localStorage.setItem("tema", novo); } catch { /* armazenamento indisponível */ }
  });
}

function fecharMenuAoNavegar() {
  const menu = $("#menuPrincipal");
  $$("#menuPrincipal .nav-link").forEach((link) =>
    link.addEventListener("click", () => {
      if (innerWidth < 992 && menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    })
  );
}

function renderTimeline() {
  $(".timeline").innerHTML = EVENTOS.map((e, i) => `
    <article class="timeline-item">
      <time class="timeline-year" datetime="${e.ano}">${e.ano}</time>
      <div class="timeline-card"><span class="timeline-dot" aria-hidden="true">${i % 2 ? "✧" : "✦"}</span><h3>${e.titulo}</h3><p>${e.texto}</p></div>
    </article>`).join("");
}

function ativarFadeIn() {
  const alvos = $$(".hero-copy, .hero-art, .about-photo, .section-heading, .mini-card, .timeline-item, .legacy-card, .quote-panel, .gallery-card, .accordion-item, .nota-panel, .quiz-panel");
  alvos.forEach((el) => el.classList.add("fade-in"));
  if (!("IntersectionObserver" in window)) return alvos.forEach((el) => el.classList.add("is-visible"));
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  alvos.forEach((el) => obs.observe(el));
}

function controlarScroll() {
  const botao = $("#backToTop"), barra = $("#progresso");
  const atualizar = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    botao.classList.toggle("visible", scrollY > 450);
  };
  addEventListener("scroll", atualizar, { passive: true });
  atualizar();
  botao.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}

function animarContador() {
  const el = $("#yearsCounter"), ini = 1815, fim = 1852;
  if (reduzMovimento || !("IntersectionObserver" in window)) return;
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    let ano = ini;
    const t = setInterval(() => {
      el.textContent = `${ini} → ${ano}`;
      if (ano >= fim) clearInterval(t);
      ano++;
    }, 35);
  }, { threshold: 0.7 });
  obs.observe(el);
}

function girarCitacoes() {
  const q = $("#citacao"), f = $("#citacaoFonte");
  let i = 0;
  const mostrar = (n) => {
    i = (n + CITACOES.length) % CITACOES.length;
    q.textContent = CITACOES[i].texto;
    f.textContent = CITACOES[i].fonte;
  };
  $("#citAnterior").addEventListener("click", () => mostrar(i - 1));
  $("#citProxima").addEventListener("click", () => mostrar(i + 1));
  mostrar(0);
}

/* Números de Bernoulli em frações exatas (algoritmo de Akiyama–Tanigawa). */
const mdc = (a, b) => (b ? mdc(b, a % b) : a < 0n ? -a : a);
function fracao(n, d) {
  if (d < 0n) { n = -n; d = -d; }
  const g = mdc(n, d) || 1n;
  return [n / g, d / g];
}
function bernoulli(m) {
  const A = [];
  for (let j = 0; j <= m; j++) {
    A[j] = [1n, BigInt(j + 1)];
    for (let k = j; k >= 1; k--) {
      const [a, b] = A[k - 1], [c, d] = A[k];
      A[k - 1] = fracao(BigInt(k) * (a * d - c * b), b * d);
    }
  }
  return A[0];
}
function iniciarBernoulli() {
  const campo = $("#nBernoulli"), saida = $("#bernoulliResultado");
  const mostrar = () => {
    const n = +campo.value, [num, den] = bernoulli(n);
    const sinal = num < 0n ? "−" : "";
    const abs = num < 0n ? -num : num;
    const dec = (Number(num) / Number(den)).toLocaleString("pt-BR", { maximumFractionDigits: 6 });
    $("#nValor").textContent = n;
    saida.innerHTML = `B<sub>${n}</sub> = ${sinal}${abs}${den === 1n ? "" : "/" + den}<small>≈ ${dec}</small>`;
  };
  campo.addEventListener("input", mostrar);
  mostrar();
}

function iniciarQuiz() {
  const caixa = $("#quizBox");
  let i = 0, pontos = 0;
  const tela = () => {
    if (i >= PERGUNTAS.length) {
      caixa.innerHTML = `<p class="quiz-final">Você acertou ${pontos} de ${PERGUNTAS.length} ✦</p><p class="body-copy">${pontos >= 5 ? "Ada ficaria orgulhosa!" : "Que tal rever a linha do tempo e tentar de novo?"}</p><button type="button" class="btn btn-primary rounded-pill px-4" id="quizReiniciar">Jogar de novo</button>`;
      $("#quizReiniciar").onclick = () => { i = 0; pontos = 0; tela(); };
      return;
    }
    const p = PERGUNTAS[i];
    caixa.innerHTML = `<small class="quiz-count">PERGUNTA ${i + 1} / ${PERGUNTAS.length}</small><h3>${p.q}</h3>${p.o.map((t, k) => `<button type="button" class="quiz-opcao" data-k="${k}">${t}</button>`).join("")}<p class="quiz-msg" aria-live="polite"></p>`;
    $$(".quiz-opcao", caixa).forEach((b) => b.addEventListener("click", () => {
      const ok = +b.dataset.k === p.c;
      if (ok) pontos++; else b.classList.add("errada");
      $$(".quiz-opcao", caixa).forEach((x, n) => { x.disabled = true; if (n === p.c) x.classList.add("certa"); });
      $(".quiz-msg", caixa).innerHTML = `${ok ? "Isso mesmo!" : "Quase!"} ${p.e} <button type="button" class="btn btn-sm btn-outline-primary rounded-pill ms-2" id="quizProx">${i + 1 < PERGUNTAS.length ? "Próxima" : "Ver resultado"}</button>`;
      $("#quizProx").onclick = () => { i++; tela(); };
    }));
  };
  tela();
}

/* Decorações e números animados */
const SIMB = ["∑", "π", "∞", "λ", "√", "∫", "Δ", "0", "1", "✦", "✧", "❀"];
function contar(el) {
  const fim = +el.dataset.alvo;
  if (reduzMovimento) return (el.textContent = fim);
  const t0 = performance.now();
  const passo = (t) => {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(fim * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}
document.addEventListener("DOMContentLoaded", () => {
  $$(".deco-simbolos").forEach((c) => {
    c.innerHTML = Array.from({ length: 14 }, () => `<span style="left:${Math.random() * 96}%;font-size:${14 + Math.random() * 22}px;animation-duration:${16 + Math.random() * 18}s;animation-delay:-${Math.random() * 30}s">${SIMB[Math.floor(Math.random() * SIMB.length)]}</span>`).join("");
  });
  const alvos = $$(".numero, .divisor");
  alvos.forEach((e) => e.classList.add("fade-in"));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-visible");
    io.unobserve(e.target);
    const n = $("strong[data-alvo]", e.target);
    if (n) contar(n);
  }), { threshold: 0.4 });
  alvos.forEach((e) => io.observe(e));
});
