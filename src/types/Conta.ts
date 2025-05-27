import { Armazenador } from "./Armazenador.js";
import { GrupoTransacao } from "./GrupoTransacao.js";
import { TipoTransacao } from "./TipoTransacao.js";
import { Transacao } from "./Transacao.js";

export class Conta {
 protected   nome: string
   protected saldo: number = Armazenador.obter<number>("saldo") || 0;
    protected transacoes: Transacao[] = Armazenador.obter<Transacao[]>(("transacoes"), (key: string, value: any)=>{
        if(key ==='data'){
            return new Date(value);
        }
        return value;
    }) || [];

    constructor(nome:string){
        this.nome = nome;
    }
 
    public getTitular() {
      return  this.nome;
    }

   getGruposTransacoes(): GrupoTransacao[] {
       const gruposTransacoes: GrupoTransacao[] = [];
       const listaTransacoes: Transacao[] = structuredClone(this.transacoes); // Faz uma cópia da lista de transações
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
   }
   getSaldo(): number {
    return this.saldo;
   }
   getDatadeAcesso(): Date {
    return new Date();
   }

   registrarTrasacao(novaTransacao: Transacao): void {
   
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

   debitar(valor: number): void {
    if(valor <= 0){
        throw new Error("O valor a ser debitado deve ser maior que zero!");
    }

    if(valor > this.saldo){
        throw new Error("Saldo insuficiente!");
    }

    this.saldo -= valor;
   Armazenador.salvar("saldo", JSON.stringify(this.saldo)); // Atualiza o saldo no localStorage
}

depositar(valor: number): void {
    if(valor <= 0){
        throw new Error("O valor a ser depositado deve ser maior que zero!");
    }
    this.saldo += valor;
    Armazenador.salvar("saldo", JSON.stringify(this.saldo)); // Atualiza o saldo no localStorage
}

}
export class ContaPremium extends Conta {

    registrarTransacao(transacao: Transacao): void {
        if(transacao.tipoTransacao === TipoTransacao.DEPOSITO){
            console.log("Gangou um bônus de 0.50 centavos por depósito!");
            transacao.valor += 0.5; // Adiciona o bônus de 0.50 centavos ao valor do depósito
        }
        super.registrarTrasacao(transacao); // Chama o método da classe pai para registrar a transação
    }
}

const conta = new Conta("Lucas Alves Cutrim");
const contaPremium = new ContaPremium("Nadson Cutrim");
export default conta;