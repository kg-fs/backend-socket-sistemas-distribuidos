function procesarCompra(productosCatalogo, productosCompra){

    let detalle = [];

    let subtotal = 0;

    for(const item of productosCompra){

        const producto = productosCatalogo.find(
            p => p.id === item.id
        );

        if(!producto){

            continue;

        }

        const totalProducto =
            producto.precio * item.cantidad;

        subtotal += totalProducto;

        detalle.push({

            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: item.cantidad,
            total: totalProducto

        });

    }

    const iva = subtotal * 0.15;

    const total = subtotal + iva;

    return {

        detalle,
        subtotal,
        iva,
        total

    };

}

module.exports = procesarCompra;