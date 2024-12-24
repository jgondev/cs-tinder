let clientes = [];

const addClient = (res) => {
    clientes.push(res);
};

const removeClient = (res) => {
    clientes = clientes.filter((cliente) => cliente !== res);
};

const broadcast = (evento) => {
    clientes.forEach((cliente) => {
        cliente.write(`data: ${JSON.stringify(evento)}\n\n`);
    });
};

module.exports = {
    addClient,
    removeClient,
    broadcast,
};
