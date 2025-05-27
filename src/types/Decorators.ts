export function ValidaDebito(target: any, propertyKey: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;

    descriptor.value = function(valorDoDebito: number){
        if (valorDoDebito <= 0) {
            throw new Error("Valor do débito deve ser maior que zero.");
        }

        if (this.saldo < valorDoDebito) {
            throw new Error("Saldo insuficiente para realizar o débito.");
        }

        return originalMethod.apply(this, [valorDoDebito]);
    }

        return descriptor;


}