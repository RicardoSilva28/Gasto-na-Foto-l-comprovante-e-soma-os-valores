let totalGastos = 0;
let quantidadeComprovantes = 0;

let pedido = "Leia o comprovante da imagem e organize as informacoes de forma limpa e bonita para exibir em uma pagina web. Mostre o nome do estabelecimento apenas uma vez no inicio. Em seguida, liste cada produto em uma nova linha, mostrando um emoji relacionado ao produto, o nome do produto e o valor. Use este formato: 🛒 PRODUTO — R$ 0,00. No final, mostre o total com destaque usando: 💰 TOTAL: R$ 0,00. Nao repita o nome do estabelecimento em cada produto. Nao mostre categorias. Mantenha os valores exatamente como aparecem no comprovante. Nao adicione explicacoes ou comentarios.";


async function lerFoto() {

    // Pegar a foto escolhida
    let foto = document.querySelector(".foto").files[0];

    // Se não escolher nenhuma foto, para aqui
    if (!foto) {
        return;
    }

    // Enviar a foto para o Puter
    let resposta = await puter.ai.chat(pedido, foto);

    // Pegar o texto que a IA respondeu
    let texto = resposta.message.content;

    console.log("RESPOSTA DA IA:");
    console.log(texto);


    // ==========================================
    // PEGAR O TOTAL DO COMPROVANTE
    // ==========================================

    let partes = texto.match(/TOTAL\s*:\s*R\$\s*([\d.,]+)/i);

    console.log("TOTAL ENCONTRADO:");
    console.log(partes);


    if (partes) {

        // Pegar somente o número
        let valor = partes[1];

        // Transformar:
        // 1.250,50 -> 1250.50
        valor = valor.replace(/\./g, "").replace(",", ".");

        // Transformar texto em número
        valor = Number(valor);

        // Somar com os comprovantes anteriores
        totalGastos = totalGastos + valor;

        // Mostrar o novo total no H2
        document.querySelector("#total-gastos").textContent =
            "R$ " + totalGastos.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }


    
    // CONTAR COMPROVANTES
    

    quantidadeComprovantes++;

    document.querySelector("#comprovante-lidos").textContent =
        quantidadeComprovantes + " Comprovantes Lidos";


    
    // CRIAR BLOCO DO COMPROVANTE
    

    let novoBloco = document.createElement("div");

    novoBloco.classList.add("bloco-nota");


    
    // FORMATAR O TEXTO
    

    let textoFormatado = texto.replace(/\n/g, "<br>");


    // Deixar somente o valor do TOTAL verde
    textoFormatado = textoFormatado.replace(
        /(💰\s*TOTAL:\s*)(R\$\s*[\d.,]+)/gi,
        '$1<span class="valor-total">$2</span>'
    );


    // Colocar o texto dentro do bloco
    novoBloco.innerHTML = textoFormatado;


    
    // COLOCAR O BLOCO NA PÁGINA
  

    document.querySelector(".lista").appendChild(novoBloco);

}