let totalGastos = 0;
let quantidadeComprovantes = 0;



// PEDIDO PARA A IA


let pedido = "Leia o comprovante da imagem e organize as informacoes de forma limpa e bonita para exibir em uma pagina web. " +

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



// CONVERTER VALOR


function converterValor(valor) {

    valor = valor.trim();


    // Remove R$ ou $
    valor = valor.replace("R$", "");
    valor = valor.replace("$", "");
    valor = valor.trim();


   
    // TEM VIRGULA E PONTO
    // Exemplo: 1.250,50
   

    if (valor.includes(",") && valor.includes(".")) {

        valor = valor.replace(/\./g, "");
        valor = valor.replace(",", ".");

    }


   
    // TEM SOMENTE VIRGULA
    // Exemplo: 16,50
  

    else if (valor.includes(",")) {

        valor = valor.replace(",", ".");

    }


  
    // TEM SOMENTE PONTO
    // Exemplo: 16.5
    //
    // NÃO remover o ponto!
  

    else if (valor.includes(".")) {

        valor = valor;

    }


    return Number(valor);
}



// LER FOTO


async function lerFoto() {

    let foto = document.querySelector(".foto").files[0];


    if (!foto) {
        return;
    }


   
    // ENVIAR PARA O PUTER
   

    let resposta = await puter.ai.chat(pedido, foto);


    let texto = resposta.message.content;


    console.log("RESPOSTA DA IA:");
    console.log(texto);


   
    // PEGAR O TOTAL DO COMPROVANTE
    

    let partes = texto.match(
        /TOTAL\s*:\s*(?:R\$|\$)\s*([\d.,]+)/i
    );


    console.log("TOTAL ENCONTRADO:");
    console.log(partes);


    if (partes) {

        let valor = converterValor(partes[1]);


        console.log("VALOR CONVERTIDO:");
        console.log(valor);


       
        // SOMAR AO TOTAL GERAL
        

        totalGastos = totalGastos + valor;


        console.log("TOTAL GERAL:");
        console.log(totalGastos);


       
        // MOSTRAR NO TOPO
       

        document.querySelector("#total-gastos").textContent =
            "R$ " +
            totalGastos.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }


    
    // CONTADOR DE COMPROVANTES
    

    quantidadeComprovantes++;


    document.querySelector("#comprovante-lidos").textContent =
        quantidadeComprovantes +
        (
            quantidadeComprovantes === 1
                ? " Comprovante Lido"
                : " Comprovantes Lidos"
        );


   
    // CRIAR BLOCO DA NOTA
    

    let novoBloco = document.createElement("div");


    novoBloco.classList.add("bloco-nota");


    
    // FORMATAR TEXTO
   

    let textoFormatado =
        texto.replace(/\n/g, "<br>");


    // Remover ** do Markdown
    textoFormatado =
        textoFormatado.replace(/\*\*/g, "");


   
    // DEIXAR SOMENTE O TOTAL VERDE
   

    textoFormatado = textoFormatado.replace(
        /(💰\s*TOTAL:\s*)(R\$\s*[\d.,]+|\$\s*[\d.,]+)/gi,
        '$1<span class="valor-total">$2</span>'
    );


   
    // MOSTRAR BLOCO
    

    novoBloco.innerHTML = textoFormatado;


    document.querySelector(".lista")
        .appendChild(novoBloco);
}