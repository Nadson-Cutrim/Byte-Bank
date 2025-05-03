const elementoFormulario = document.querySelector(".block-nova-transacao form") as HTMLFormElement;
elementoFormulario.addEventListener('submit', function (event) {
event.preventDefault(); // Evita o envio do formulário
if(!elementoFormulario.checkValidity()) {
    alert("Preencha todos os campos da transação corretamente!");
    return;
}
const inputTipoTrasacao = elementoFormulario.querySelector("#tipoTransacao") as HTMLSelectElement;
const inputValor = elementoFormulario.querySelector("#valor") as HTMLInputElement;
const inputData = elementoFormulario.querySelector("#data") as HTMLInputElement;

let tipoTransacao: string = inputTipoTrasacao.value;
let valor: number = inputValor.valueAsNumber;
let data: Date = new Date(inputData.value);

if (tipoTransacao === "Depósito") {
    saldo += valor;
}else if (tipoTransacao === "Transferência" || tipoTransacao === "Pagamento de Boleto") {
    saldo -= valor;
}else{
    alert("Tipo de transação inválido!");
    return;
}
elementoSaldo.textContent = saldo.toString(); // Atualiza o saldo na tela
const novaTransacao = {
    tipoTransacao: tipoTransacao,
    valor: valor,
    data: data
}
console.log(novaTransacao);
elementoFormulario.reset(); // Limpa os campos do formulário
})
