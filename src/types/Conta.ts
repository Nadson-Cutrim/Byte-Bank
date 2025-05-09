
import { Transacao } from "./Transacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { GrupoTransacao } from "./GrupoTransacao.js";

let saldo: number = JSON.parse(localStorage.getItem("saldo")) || 0; // Inicializa o saldo com o valor armazenado no localStorage ou 0 se não houver valor armazenado
const transacoes: Transacao[] = JSON.parse(localStorage.getItem("transacoes"), (key: string, value: string)=>{
    if(key === "data"){
        return new Date(value);
    }

    return value;

}) || [];

function debitar(valor: number): void {
    if(valor <= 0){
        throw new Error("O valor a ser debitado deve ser maior que zero!");
    }

    if(valor > saldo){
        throw new Error("Saldo insuficiente!");
    }

    saldo -= valor;
    localStorage.setItem("saldo", JSON.stringify(saldo)); // Atualiza o saldo no localStorage
}

function depositar(valor: number): void {
    if(valor <= 0){
        throw new Error("O valor a ser depositado deve ser maior que zero!");
    }
    saldo += valor;
    localStorage.setItem("saldo", JSON.stringify(saldo)); // Atualiza o saldo no localStorage
}

const Conta = {
getSaldo(){
    return saldo;
},
getDatadeAcesso(){
    return new Date();
},
getGruposTransacoes(): GrupoTransacao[] {
    const gruposTransacoes: GrupoTransacao[] = [];
    const listaTransacoes: Transacao[] = structuredClone(transacoes); // Faz uma cópia da lista de transações
    const transacoesOrdenadas: Transacao[] = listaTransacoes.sort((t1,t2) => t2.data.getTime() - t1.data.getTime()); // Ordena as transações por data (mais recente primeiro)
    
    let labelAtualGrupoTransacao: string = ""; // Variável para armazenar o label do grupo atual
    
    for(let transacao of transacoesOrdenadas){
        let labelGrupoTransacao: string = transacao.data.toLocaleDateString("pt-BR", {month: "long", year: "numeric"}); // Formata a data para o formato desejado
        
        if (labelAtualGrupoTransacao !== labelGrupoTransacao) {

            labelAtualGrupoTransacao = labelGrupoTransacao; // Atualiza o label do grupo atual
            
            gruposTransacoes.push({
                label: labelGrupoTransacao,
                transacoes: []
            });
        }
        
        gruposTransacoes.at(-1).transacoes.push(transacao); // Adiciona a transação ao grupo atual
    }
    return gruposTransacoes; // Retorna a lista de grupos de transações
},
registrarTrasacao(novaTransacao: Transacao): void {

    if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
       depositar(novaTransacao.valor);
    }
    else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
        debitar(novaTransacao.valor);
        novaTransacao.valor *= -1; // Inverte o valor da transação para que fique negativo
    }
    else {
        throw new Error("Tipo de transação inválido!");
    }

  
    transacoes.push(novaTransacao); // Adiciona a nova transação ao array de transações
    localStorage.setItem("transacoes", JSON.stringify(transacoes)); // Salva as transações no localStorage
    console.log(this.getGruposTransacoes()); // Exibe os grupos de transações no console para depuração

}

}
export default Conta; // 