/* =====================================================================
   AKGL CONNECT TECH — SCRIPT PRINCIPAL
   Organização:
   1. Ano atual automático no rodapé
   2. Botão "voltar ao topo"
   3. Animação de fundo (rede de pontos conectados)
   ===================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------------------
     1. ANO ATUAL AUTOMÁTICO
     Atualiza o ano no rodapé sem precisar editar o HTML todo ano.
  ------------------------------------------------------------------- */
  const anoAtualEl = document.getElementById("ano-atual");
  if (anoAtualEl) {
    anoAtualEl.textContent = new Date().getFullYear();
  }

  /* -------------------------------------------------------------------
     2. BOTÃO "VOLTAR AO TOPO"
     Aparece depois que o usuário rola a página, some quando está no topo.
  ------------------------------------------------------------------- */
  const btnTopo = document.getElementById("btn-topo");

  if (btnTopo) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        btnTopo.classList.add("visivel");
      } else {
        btnTopo.classList.remove("visivel");
      }
    });

    btnTopo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* -------------------------------------------------------------------
     3. ANIMAÇÃO DE FUNDO — REDE DE PONTOS CONECTADOS
     Desenha pequenos pontos que se movem lentamente e traça linhas entre
     os que estão próximos, simulando uma rede / circuito tecnológico.
     É puramente decorativo (aria-hidden) e respeita "prefers-reduced-motion".
  ------------------------------------------------------------------- */
  const canvas = document.getElementById("network-bg");
  const prefereMenosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && !prefereMenosMovimento) {
    const ctx = canvas.getContext("2d");
    let largura, altura, pontos;

    // Cores usadas nas linhas e pontos (seguem a paleta da marca)
    const COR_PONTO = "rgba(0, 120, 215, 0.9)";
    const COR_LINHA = "0, 120, 215"; // usado dentro de rgba()

    function dimensionarCanvas() {
      largura = canvas.width = window.innerWidth;
      altura = canvas.height = window.innerHeight;
    }

    function criarPontos() {
      // Quantidade de pontos proporcional ao tamanho da tela (mais leve em celulares)
      const quantidade = Math.floor((largura * altura) / 22000);
      pontos = Array.from({ length: quantidade }, () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      }));
    }

    function atualizarPontos() {
      pontos.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Rebate nas bordas da tela
        if (p.x < 0 || p.x > largura) p.vx *= -1;
        if (p.y < 0 || p.y > altura) p.vy *= -1;
      });
    }

    function desenhar() {
      ctx.clearRect(0, 0, largura, altura);

      const distanciaMaxima = 140;

      // Linhas entre pontos próximos
      for (let i = 0; i < pontos.length; i++) {
        for (let j = i + 1; j < pontos.length; j++) {
          const dx = pontos[i].x - pontos[j].x;
          const dy = pontos[i].y - pontos[j].y;
          const distancia = Math.sqrt(dx * dx + dy * dy);

          if (distancia < distanciaMaxima) {
            const opacidade = 1 - distancia / distanciaMaxima;
            ctx.strokeStyle = `rgba(${COR_LINHA}, ${opacidade * 0.3})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pontos[i].x, pontos[i].y);
            ctx.lineTo(pontos[j].x, pontos[j].y);
            ctx.stroke();
          }
        }
      }

      // Pontos
      ctx.fillStyle = COR_PONTO;
      pontos.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    function loop() {
      atualizarPontos();
      desenhar();
      requestAnimationFrame(loop);
    }

    dimensionarCanvas();
    criarPontos();
    loop();

    // Recalcula tudo se a janela for redimensionada
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        dimensionarCanvas();
        criarPontos();
      }, 200);
    });
  }

});
