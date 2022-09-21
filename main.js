const informacionImportante = document.getElementById("informacionImportante");
const formulario = document.getElementById("form");
let datosUsuario = {};
const carrito = [];
const registroExitoso = JSON.parse(sessionStorage.getItem("datosDeUsuario"));


if (registroExitoso === null){
    // Aquí está todo lo del form y el listener 
    formulario.addEventListener("submit", (e) => {

        const nombre = document.getElementById("nombre").value;
        const direccion = document.getElementById("direccion").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
    
        e.preventDefault();
        
        datosUsuario = {
            nombre,
            direccion,
            correo,
            telefono,
        }

        console.log(datosUsuario)

        const infoUserJson = JSON.stringify(datosUsuario);
        sessionStorage.setItem("datosDeUsuario", infoUserJson);


        Swal.fire({
            title: 'Registro exitoso',
            text: `Vamos a comprar ${datosUsuario.nombre}`,
            icon: 'success',
            // segun la palabra clave es el icono
            showConfirmButton: 'Ok',
            timer: 2000,
            // buttons: false,
        }) 
        document.body.removeChild(formulario);
        
        mostrarProductos()
    })
    }else{
        console.log(registroExitoso)
        formulario.style.display = "none";
        Swal.fire({
        title: 'Ya te has registrado previamente',
        text: `Continuemos tu proceso de compra ${registroExitoso.nombre}`,
        icon: 'success',
        // segun la palabra clave es el icono
        // confirm: 'Ok',
        timer: 2000,
        // buttons: false,
    })
        mostrarProductos();
    }



// Este es el encargado de renderizar las cards para poder comprar 

function mostrarProductos (){
    
    const contenedor = document.getElementById("producto-contenedor");
    productos.forEach( producto => {
        const div = document.createElement("div");
        div.classList.add("card");
        div.innerHTML = `<div class="card-image" id="supTotal">
                            <img class="imgCards" id="suplemento${producto.id}" src=${producto.img}>
                            <br>
                            <span class="cardText" id="card-title" >Producto: ${producto.nombre}</span>
                            <br>
                            <span class="cardText" id="card-precio">Precio: ${producto.precio}</span>
                            <br>
                            <span class="cardText" id="card-marca">Marca de producto: ${producto.marca}</span>
                            <br>
                            <span class="cardText" id="card-descripcion">Descripcion: ${producto.descripcion}</span>
                            <br>
                            <br>
                            <button type="button" class="botonCard" onclick="agregarProductoAlCarrito(${producto.id})" id="botonDeCompra${producto.id}">Comprar ahora</button>
                            <br>
                            <a href="${producto.video}" target="blank" id="esParaTi">¿Este producto es para mi?</a>
                        </div>
                        `
        contenedor.appendChild(div);
        
    });

};

function agregarProductoAlCarrito(id) {
    let producto = productos.find(producto => producto.id === id);
    let productoEnCarrito = carrito.find(productoEnCarrito => productoEnCarrito.id === id);

    productoEnCarrito ? aumentarCantidad()
    : pushearCarrito()

    renderProductos();
    renderTotal();
    calcularTotal();

    function aumentarCantidad(){
        productoEnCarrito.cantidad ++
        alertToastAgregar();
    }

function pushearCarrito(){
    producto.cantidad = 1;
    productoEnCarrito = 1;
    carrito.push(producto)
    alertToastAgregar();
    } 

function alertToastAgregar () {
    Toastify({
        text: (`Has agregado ${producto.cantidad} ${producto.nombre} a tu carrito de compra.`),
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
      }).showToast();
    }
}

// Aqui ya se renderizan los productos del carrito a la pantalla
function renderProductos(){
    let carritoHTML = document.getElementById("carrito")
    let HTMLcarrito = ""
    carrito.forEach((producto, id) =>{
        HTMLcarrito += `
        <div class="card-carrito" id="supComprado">
                            <span class="cardText" id="card-title" > Compra: ${producto.nombre}</span>
                            <br>
                            <br>
                            <span class="cardText" id="card-precio">Precio: ${producto.precio}</span>
                            <br>
                            <br>
                            <span class="cardText" id="card-precio">Cantidad comprado: ${producto.cantidad}</span>
                            <br>
                            <br>
                            <button type="button" class="botonEliminar" onclick="eliminarProducto(${id})" id="botonEliminar${producto.id}">Eliminar</button>
                        </div>
        `
    })

    carritoHTML.innerHTML = HTMLcarrito

    document.body.appendChild(carritoHTML)

}

// Esto renderiza el carrito de compras
function renderTotal(){
    let totalHTML = document.getElementById("totales")
   totalHTML.innerHTML = `            
   <div>
    <h2 id="totalCompra"></h2>
    </div>
    `
    document.body.appendChild(totalHTML)

}

// Con esto ya se pueden eliminar los productos
function eliminarProducto(id) {

    carrito[id].cantidad--;

    if (carrito[id].cantidad == 0){
        carrito.splice(id, 1)
    }

    renderProductos();
    calcularTotal();


    console.log(carrito);

    swal.fire({
        title: 'Borrado!',
        icon: 'success',
        text: 'El producto ha sido borrado con éxito',
    })
}


let totalCalculado = 0;
// Esta parte ya calcula los totales de mi producto y los imprime
function calcularTotal(){
    let total = 0;
    carrito.forEach((producto) =>{
        total += producto.precio * producto.cantidad
    })
    

    const totalFinal = document.getElementById("totalCompra")
    totalFinal.innerHTML = `<h3> Total de compra: $${total} 
                            <button type="button" class="botonCompraTotal" onclick="comprarProductos()" id="botonDeCompraFinal">Finalizar Compra</button>
                            <h3/>
    `
    totalCalculado = total;
}


// Aqui ya agrego el getItem del sessionStorage, 
// se integra al alert despues de haber llenado el form y comprado algo
// SE INTEGRA DESESTRUCTURACIÓN DEL GETITEM DEL SESSION STORAGE
// SE AGREGA EL USO DE TERNARIOS
// Se borra la sesion storage y se fuerza el cierre, esto es para evitar compras dobles y crear un nuevo ciclo
function comprarProductos(){
    const informacionEntrega = JSON.parse(sessionStorage.getItem("datosDeUsuario"));

    let {nombre, direccion, correo,telefono} = informacionEntrega;

    Swal.fire({
        title: `¿Listo para finalizar tu compra?`,
        html:'<img class="imgCierre" id="compra" src=imgs/Confirmacion.png style="width: 80px;" style="height: 80px;">',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Listo!',
        cancelButtonText: 'Todavia no!'
      }).then((result) => {

        result.isConfirmed === false ? Swal.fire('Agrega/Quita los productos que necesites')
        : result.isConfirmed === true && totalCalculado === 0 ? carritoEnCeros()
        : compraFinalizada();      
      })

        function compraFinalizada (){
            Swal.fire({
                title: 'Comprado',
                text: `Gracias por tu compra ${nombre}, enviaremos tu recibo de compra a ${correo}, tu(s) producto(s) se enviarán a la direccion ubicada en ${direccion} y cualquier inconveniente o emergencia nos contactaremos contigo al numero ${telefono}`,
                icon: 'success',
                showConfirmButton: 'Ok',
                timer: 5000,
            }) .then(() => {
            sessionStorage.clear()
            window.location.reload()     
              })

        }   

        function carritoEnCeros(){
            Swal.fire({
                icon: 'error',
                title: 'No pudimos concretar tu compra',
                text: 'Necesitas tener productos en tu carrito para continuar',
              })
        }
}