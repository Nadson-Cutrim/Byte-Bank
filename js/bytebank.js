var saldo = 3000;
var elementoSaldo = document.querySelector(".saldo-valor .valor");
if (elementoSaldo != null) {
    elementoSaldo.textContent = saldo.toString();
}
var elementoFormulario = document.querySelector(".block-nova-transacao form");
elementoFormulario.addEventListener('submit', function (event) {
    event.preventDefault(); // Evita o envio do formulário
    if (!elementoFormulario.checkValidity()) {
        alert("Preencha todos os campos da transação corretamente!");
        return;
    }
    var inputTipoTrasacao = elementoFormulario.querySelector("#tipoTransacao");
    var inputValor = elementoFormulario.querySelector("#valor");
    var inputData = elementoFormulario.querySelector("#data");
    var tipoTransacao = inputTipoTrasacao.value;
    var valor = inputValor.valueAsNumber;
    var data = new Date(inputData.value);
    if (tipoTransacao === "Depósito") {
        saldo += valor;
    }
    else if (tipoTransacao === "Transferência" || tipoTransacao === "Pagamento de Boleto") {
        saldo -= valor;
    }
    else {
        alert("Tipo de transação inválido!");
        return;
    }
    elementoSaldo.textContent = saldo.toString(); // Atualiza o saldo na tela
    var novaTransacao = {
        tipoTransacao: tipoTransacao,
        valor: valor,
        data: data
    };
    console.log(novaTransacao);
    elementoFormulario.reset(); // Limpa os campos do formulário
});
