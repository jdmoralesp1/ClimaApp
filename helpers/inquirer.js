const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [ 
        //Esta es la mejor forma de manejar mis opciones y puedo ver el value y name como el option de html
            {
                value: 1,
                name: `${'1.'.green} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.green} Historial`
            },
            {
                value: 0,
                name: `${'0.'.green} Salir`
            },
        ]
    }
];

const inquirerMenu= async() =>{
    console.clear();
    console.log('======================='.green);
    console.log(' Seleccione una opción '.white);
    console.log('=======================\n'.green);
    //Aca desestructuro lo que recibo del inquirer pregunta y retorno solamente el valor 
    //que me interesa que es el numero de la opción que es el nombre en la linea 7
    const { opcion } = await inquirer.prompt(preguntas); 

    return opcion;
};

const pausa = async() => {

    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `\nPresione ${'ENTER'.green} para continuar`
        }
    ]

    console.log("\n");
    await inquirer.prompt(question);

}


const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            //asi se define una funcion dentro de un objeto para que haga una validación
            validate(value){
                if(value.length === 0) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    //Esto me devuelve el objeto completo del question, por eso desestructuro y tomo solo la desc
    //que es la que me interesa
    const { desc } = await inquirer.prompt(question);
    return desc;
}


const listarLugares = async(lugares =[]) => {
    
    const choices = lugares.map((lugar, i) =>{

        const idx = `${i+1}.`.green;
        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione lugar:',
            choices: choices
        }
    ]

    const { id } = await inquirer.prompt(preguntas);

    return id;
}

//Esta función la uso para confirmar algo, se puede reutilizar
//El mesagge puede ser algo como "esta seguro?" o cualquier cosa por el estilo
const confirmar = async(message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message: message
        }
    ];

    const { ok } = await inquirer.prompt(question);
    return ok;
}

//mostrar las tareas que ya estan hechas y asi mismo enviar las que quiere completar o descompletar
const mostrarListadoChecklist = async(tareas =[]) => {
    const choices = tareas.map((tarea, i) =>{

        const idx = `${i+1}.`.green;
        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false
        }
    });


    //Por medio de choices envia el value, name y el cheked de la tarea porque usamos un checkbox
    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Seleccione',
            choices: choices
        }
    ]

    const { ids } = await inquirer.prompt(pregunta);

    return ids;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}