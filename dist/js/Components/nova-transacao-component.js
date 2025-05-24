import Conta from "../types/Conta.js";
import SaldoComponent from "./saldo-component.js";
import ExtratoComponent from "./extrato-component.js";
const elementoFormulario = document.querySelector(".block-nova-transacao form");
elementoFormulario.addEventListener("submit", function (event) {
    try {
        event.preventDefault(); // Evita o envio do formulário
        if (!elementoFormulario.checkValidity()) {
            alert("Preencha todos os campos da transação corretamente!");
            return;
        }
        const inputTipoTrasacao = elementoFormulario.querySelector("#tipoTransacao");
        const inputValor = elementoFormulario.querySelector("#valor");
        const inputData = elementoFormulario.querySelector("#data");
        let tipoTransacao = inputTipoTrasacao.value;
        let valor = inputValor.valueAsNumber;
        let data = new Date(inputData.value + " 00:00:00");
        const novaTransacao = {
            tipoTransacao: tipoTransacao,
            valor: valor,
            data: data,
        };
        Conta.registrarTrasacao(novaTransacao); // Atualiza o saldo na conta
        SaldoComponent.atualizar(); // Atualiza o saldo na tela
        ExtratoComponent.atualizar(); // Atualiza o extrato na tela
        elementoFormulario.reset(); // Limpa os campos do formulário
    }
    catch (error) {
        alert(error.message); // Exibe o erro para o usuário
    }
});
