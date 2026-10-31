/* ==========================================================
   Cartões de projeto "flutuantes" (passando pela tela)
   O HTML não muda: este script pega os .card que já estão dentro de
   .card-projetos e monta uma fileira que anda sozinha, em loop.
   ========================================================== */
(function () {
    var lista = document.querySelector('.card-projetos');
    if (!lista) return; // se a página não tiver projetos, não faz nada

    // Quem pediu "reduzir movimento" no aparelho fica com a fileira parada (rolagem manual)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var VELOCIDADE = 60; // pixels por segundo (menor = mais devagar)
    var ESPACO = 24;     // espaço entre cartões; precisa ser igual ao "gap" do CSS

    // 1. Junta os cartões originais em um "grupo" e coloca o grupo dentro de um "trilho"
    var cartoes = Array.prototype.slice.call(lista.children);
    var trilho = document.createElement('div');
    var grupo = document.createElement('div');
    trilho.className = 'projetos-trilho';
    grupo.className = 'projetos-grupo';
    cartoes.forEach(function (c) { grupo.appendChild(c); });
    trilho.appendChild(grupo);
    lista.appendChild(trilho);

    // Cópias servem só para o efeito visual: leitores de tela e a tecla Tab ignoram
    function esconderCopia(elemento) {
        elemento.setAttribute('aria-hidden', 'true');
        Array.prototype.forEach.call(elemento.querySelectorAll('a'), function (link) {
            link.setAttribute('tabindex', '-1');
        });
    }

    // 2. Se houver poucos cartões para a largura da tela, repete até sobrar
    //    (senão apareceria um espaço vazio no final da fileira)
    var voltas = 0;
    while (grupo.scrollWidth < window.innerWidth * 1.3 && voltas < 6) {
        cartoes.forEach(function (c) {
            var copia = c.cloneNode(true);
            esconderCopia(copia);
            grupo.appendChild(copia);
        });
        voltas++;
    }

    // 3. Duplica o grupo inteiro: quando o primeiro sai da tela, o segundo já está
    //    no lugar e a animação recomeça sem ninguém perceber (loop infinito)
    var segundoGrupo = grupo.cloneNode(true);
    esconderCopia(segundoGrupo);
    trilho.appendChild(segundoGrupo);

    // 4. Define a duração para a velocidade ser a mesma não importa quantos cartões existam
    trilho.style.animationDuration = ((grupo.scrollWidth + ESPACO) / VELOCIDADE) + 's';

    // 5. Liga o modo animado (o CSS esconde a barra de rolagem e começa a mover)
    lista.classList.add('animado');
})();
