let saldo = 3000;
const elementoSaldo = document.querySelector(".saldo-valor .valor");
elementoSaldo.textContent = saldo;


const elementoFormulario = document.querySelector(".block-nova-transacao form");
elementoFormulario.addEventListener('submit', function (event) {
event.preventDefault(); // Evita o envio do formulário
if(!elementoFormulario.checkValidity()) {
    alert("Preencha todos os campos da transação corretamente!");
    return;
}
const inputTipodeTrasacao = elementoFormulario.querySelector("#tipoTransacao");
const inputValor = elementoFormulario.querySelector("#valor");
const inputData = elementoFormulario.querySelector("#data");

let tipoTransacao = inputTipodeTrasacao.value;
let valor = inputValor.value;
let data = inputData.value;

if (tipoTransacao === "Deposito") {
    saldo += valor;
}else if (tipoTransacao === "Saque" || tipoTransacao === "Pagamento de Boleto") {
    saldo -= valor;
}else{
    alert("Tipo de transação inválido!");
    return;
}

const novaTransacao = {
    tipoTransacao: tipoTransacao,
    valor: valor,
    data: data
}
console.log(novaTransacao);
elementoFormulario.reset(); // Limpa os campos do formulário
})