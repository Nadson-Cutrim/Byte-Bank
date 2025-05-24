import { Armazenador } from "./Armazenador.js";
import { TipoTransacao } from "./TipoTransacao.js";
export class Conta {
    nome;
    saldo = Armazenador.obter("saldo") || 0;
    transacoes = Armazenador.obter(("transacoes"), (key, value) => {
        if (key === 'data') {
            return new Date(value);
        }
        return value;
    }) || [];
    constructor(nome) {
        this.nome = nome;
    }
    getTitular() {
        return this.nome;
    }
    getGruposTransacoes() {
        const gruposTransacoes = [];
        const listaTransacoes = structuredClone(this.transacoes); // Faz uma cópia da lista de transações
        const transacoesOrdenadas = listaTransacoes.sort((t1, t2) => t2.data.getTime() - t1.data.getTime()); // Ordena as transações por data (mais recente primeiro)
        let labelAtualGrupoTransacao = ""; // Variável para armazenar o label do grupo atual
        for (let transacao of transacoesOrdenadas) {
            let labelGrupoTransacao = transacao.data.toLocaleDateString("pt-BR", { month: "long", year: "numeric" }); // Formata a data para o formato desejado
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
    }
    getSaldo() {
        return this.saldo;
    }
    getDatadeAcesso() {
        return new Date();
    }
    registrarTrasacao(novaTransacao) {
        if (novaTransacao.tipoTransacao === TipoTransacao.DEPOSITO) {
            this.depositar(novaTransacao.valor);
        }
        else if (novaTransacao.tipoTransacao === TipoTransacao.TRANSFERENCIA || novaTransacao.tipoTransacao === TipoTransacao.PAGAMENTO_BOLETO) {
            this.debitar(novaTransacao.valor);
            novaTransacao.valor *= -1; // Inverte o valor da transação para que fique negativo
        }
        else {
            throw new Error("Tipo de transação inválido!");
        }
        this.transacoes.push(novaTransacao); // Adiciona a nova transação ao array de transações
        Armazenador.salvar("transacoes", JSON.stringify(this.transacoes)); // Salva as transações no localStorage
        console.log(this.getGruposTransacoes()); // Exibe os grupos de transações no console para depuração
    }
    debitar(valor) {
        if (valor <= 0) {
            throw new Error("O valor a ser debitado deve ser maior que zero!");
        }
        if (valor > this.saldo) {
            throw new Error("Saldo insuficiente!");
        }
        this.saldo -= valor;
        Armazenador.salvar("saldo", JSON.stringify(this.saldo)); // Atualiza o saldo no localStorage
    }
    depositar(valor) {
        if (valor <= 0) {
            throw new Error("O valor a ser depositado deve ser maior que zero!");
        }
        this.saldo += valor;
        Armazenador.salvar("saldo", JSON.stringify(this.saldo)); // Atualiza o saldo no localStorage
    }
}
const conta = new Conta("Lucas Alves Cutrim");
export default conta;
