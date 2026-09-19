let totalGastos = 0;
let quantidadeComprovantes = 0;


// ==========================================
// PEDIDO PARA A IA
// ==========================================

let pedido =
    "Leia o comprovante da imagem e organize as informacoes de forma limpa e bonita para exibir em uma pagina web. " +

    "Mostre o nome do estabelecimento apenas uma vez no inicio. " +

    "Em seguida, liste cada produto em uma nova linha, mostrando um emoji relacionado ao produto, o nome do produto e o valor. " +

    "Use este formato: 🛒 PRODUTO — R$ 0,00. " +

    "No final, mostre o total exatamente neste formato: 💰 TOTAL: R$ 0,00. " +

    "IMPORTANTE: use sempre R$ e nunca use $. " +

    "IMPORTANTE: valores como 16.5 significam dezesseis reais e cinquenta centavos. " +

    "Valores com ponto decimal devem ser tratados como numeros decimais. " +

    "Valores brasileiros como 1.250,50 significam mil duzentos e cinquenta reais e cinquenta centavos. " +

    "Nao repita o nome do estabelecimento. " +

    "Nao mostre categorias. " +

    "Nao adicione explicacoes ou comentarios.";


// ==========================================
// CONVERTER VALOR
// ==========================================

function converterValor(valor) {

    valor = valor.trim();

    // Remover R$ ou $
    valor = valor.replace("R$", "");
    valor = valor.replace("$", "");
    valor = valor.trim();


    // Exemplo: 1.250,50
    // Resultado: 1250.50

    if (valor.includes(",") && valor.includes(".")) {

        valor = valor.replace(/\./g, "");
        valor = valor.replace(",", ".");

    }


    // Exemplo: 16,50
    // Resultado: 16.50

    else if (valor.includes(",")) {

        valor = valor.replace(",", ".");

    }


    // Exemplo: 16.5
    // Continua 16.5

    else if (valor.includes(".")) {

        valor = valor;

    }


    return Number(valor);
}


// ==========================================
// LER VÁRIAS FOTOS
// ==========================================

async function lerFotos() {

    let fotos = document.querySelector(".foto").files;


    // Se nenhuma foto foi selecionada
    if (fotos.length === 0) {
        return;
    }


    console.log(
        "Quantidade de fotos selecionadas:",
        fotos.length
    );


    // ==========================================
    // PROCESSAR UMA FOTO POR VEZ
    // ==========================================

    for (let i = 0; i < fotos.length; i++) {

        let foto = fotos[i];


        console.log(
            "Processando comprovante:",
            i + 1
        );


        try {

            // ==========================================
            // ENVIAR FOTO PARA O PUTER
            // ==========================================

            let resposta =
                await puter.ai.chat(pedido, foto);


            // Pegar resposta da IA
            let texto =
                resposta.message.content;


            console.log("RESPOSTA DA IA:");
            console.log(texto);


            // ==========================================
            // PEGAR O TOTAL
            // ==========================================

            let partes = texto.match(
                /TOTAL\s*:\s*(?:R\$|\$)\s*([\d.,]+)/i
            );


            console.log("TOTAL ENCONTRADO:");
            console.log(partes);


            // ==========================================
            // SOMAR TOTAL
            // ==========================================

            if (partes) {

                let valor =
                    converterValor(partes[1]);


                console.log("VALOR CONVERTIDO:");
                console.log(valor);


                if (!isNaN(valor)) {

                    totalGastos =
                        totalGastos + valor;


                    console.log("TOTAL GERAL:");
                    console.log(totalGastos);


                    // ==========================================
                    // ATUALIZAR TOTAL NO TOPO
                    // ==========================================

                    document.querySelector(
                        "#total-gastos"
                    ).textContent =
                        "R$ " +
                        totalGastos.toLocaleString(
                            "pt-BR",
                            {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }
                        );
                }
            }


            // ==========================================
            // CONTADOR DE COMPROVANTES
            // ==========================================

            quantidadeComprovantes++;


            document.querySelector(
                "#comprovante-lidos"
            ).textContent =
                quantidadeComprovantes +
                (
                    quantidadeComprovantes === 1
                        ? " Comprovante Lido"
                        : " Comprovantes Lidos"
                );


            // ==========================================
            // CRIAR BLOCO DA NOTA
            // ==========================================

            let novoBloco =
                document.createElement("div");


            novoBloco.classList.add(
                "bloco-nota"
            );


            // ==========================================
            // FORMATAR TEXTO
            // ==========================================

            let textoFormatado =
                texto.replace(/\n/g, "<br>");


            // Remover **
            textoFormatado =
                textoFormatado.replace(
                    /\*\*/g,
                    ""
                );


            // ==========================================
            // DEIXAR TOTAL VERDE
            // ==========================================

            textoFormatado =
                textoFormatado.replace(
                    /(💰\s*TOTAL:\s*)(R\$\s*[\d.,]+|\$\s*[\d.,]+)/gi,
                    '$1<span class="valor-total">$2</span>'
                );


            // ==========================================
            // COLOCAR TEXTO NO BLOCO
            // ==========================================

            novoBloco.innerHTML =
                textoFormatado;


            // ==========================================
            // ADICIONAR BLOCO NA PÁGINA
            // ==========================================

            document.querySelector(
                ".lista"
            ).appendChild(novoBloco);


        } catch (erro) {

            console.error(
                "Erro ao processar o comprovante:",
                erro
            );

        }
    }


    console.log(
        "Todos os comprovantes foram processados."
    );
}