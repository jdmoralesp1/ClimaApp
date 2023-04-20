//uso el dotenv para crear variables de entorno, para eos creo un archivo .env y ahi inserto mis vars
require('dotenv').config();

const { leerInput, 
    inquirerMenu, 
    pausa, 
    listarLugares 
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async() => {
    
    let opt;

    const busquedas = new Busquedas();



    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar msg 
                const termino = await leerInput('Ciudad: ');

                //Buscar los lugares
                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar
                const idSeleccionado = await listarLugares(lugares)
                    //Si escoge 0 entonces continue, que es cuando quiere cancelar
                if(idSeleccionado === '0') continue;
                    //traigo todo el objeto a partir del id del lugar que la persona selecciona cuando
                    //se listan los 5 resultados
                const lugarSel = lugares.find(l => l.id === idSeleccionado);
                //Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre)

                //Datos del clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                //Mostrar resultados
                console.clear();
                console.log('\nInformación del lugar\n'.green);
                console.log('Ciudad: ', lugarSel.nombre.green)
                console.log('Lat: ', lugarSel.lat)
                console.log('Lng: ', lugarSel.lng)
                console.log('Temperatura: ', clima.temp)
                console.log('Minima: ', clima.min)
                console.log('Máxima: ', clima.max)
                console.log('Cómo esta el clima: ', clima.desc.green)
            break;

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                //busquedas.historial.forEach((lugar, i) => {
                    const idx= `${ i + 1 }.`.green;
                    console.log(`${idx} ${lugar}`)
                })
            break;
        }

        if (opt !== 0) await pausa();
    } while (opt !== 0);


}



main();