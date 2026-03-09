// src/utils/formatters.ts

export const formatTelefone = (valor: string) => {
    let v = valor.replace(/\D/g, ''); // Tira tudo que não é número

    if (v.length > 11) v = v.substring(0, 11); // Limita a 11 dígitos

    // Aplica a formatação (XX) XXXXX-XXXX
    if (v.length > 2) v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
    if (v.length > 9) v = `${v.substring(0, 10)}-${v.substring(10)}`;

    return v;
};