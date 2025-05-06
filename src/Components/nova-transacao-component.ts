
import { Transacao } from "../types/Transacao.js";
import { TipoTransacao } from "../types/TipoTransacao.js";
import Conta from "../types/Conta.js";
import SaldoComponent from "./saldo-component.js";


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

let tipoTransacao: TipoTransacao = inputTipoTrasacao.value as TipoTransacao;
let valor: number = inputValor.valueAsNumber;
let data: Date = new Date(inputData.value);

const novaTransacao:Transacao = {
    tipoTransacao: tipoTransacao,
    valor: valor,
    data: data
    
}
Conta.registrarTrasacao(novaTransacao); // Atualiza o saldo na conta
SaldoComponent.atualizar(); // Atualiza o saldo na tela
elementoFormulario.reset(); // Limpa os campos do formulário
})
