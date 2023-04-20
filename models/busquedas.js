const fs = require('fs') ;
const axios = require('axios');

class Busquedas {

    historial = [];

    dbPath = './db/database.json'

    constructor(){
        //Leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){
        //capitalizar cada palabra
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }

    get paramsMapbox(){
        return {
            'language': 'es',
            'access_token': process.env.MAPBOK_KEY,
            'limit': 5
        }
    }

    async ciudad(lugar = ''){

        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });

            const resp = await instance.get();

            //Colocar ({}) pone implicitamente que voy a retornar un objeto
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }

        
    }

    get paramsWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY_TEMP,
            'units': 'metric',
            'lang': 'es'
        }
    }

    async climaLugar(lat, lon){
        try {
            //Petición http
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon}
            });

            const resp = await instance.get();
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    agregarHistorial(lugar = ''){
        //prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }

        //colocar mi arreglo solo de 6 posiciones
        this.historial = this.historial.splice(0,5);
        //insertar nuevo lugar en el arreglo
        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDB(){
        //Debe existir
        if(!fs.existsSync(this.dbPath)){
            return;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf8'});

        const data = JSON.parse(info);

        this.historial = data.historial;
    }

}

module.exports = Busquedas;