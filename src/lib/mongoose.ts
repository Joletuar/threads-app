import mongoose from 'mongoose';

import variables from '@/constants/variables';

let isConeted = false; // bandera para saber si ya estamos conectados o ya tenemos un conexión activa

export const connectToDB = async () => {
  mongoose.set('strictQuery', true); // con esto evitamos realizar consultas de campos que no están definidos dentro del esquema de la colección

  // verificamos si tenemos la variable de entorno con la url de la conexión a la db
  if (!variables.MONGODB_URL)
    return console.log('Conexión a MongoDB no disponible');

  // validamos si ya teniamos una conexión activa
  if (isConeted) return console.log('Ya estamos conectados');

  try {
    // realizamos la conexión hacia la bd
    await mongoose.connect(variables.MONGODB_URL);

    // cambiamos la bandera a true para indicar que ya tenemos conexión
    isConeted = true;

    console.log('Conexión a MongoDB realizado correctamente');
  } catch (error) {
    console.log('Error al conectarse a MongoDB', error);
  }
};

export const disconnectToDB = async () => {
  // si estamos en desarrollo no nos desconectamos de la bd
  if (variables.ENVIRONMENT === 'DEV') return;

  // validamos si ya teniamos una conexión activa
  if (!isConeted) return console.log('No existe conexión activa');

  try {
    // nos desconectamos de la sesión activa
    await mongoose.disconnect();

    // cambiamos la bandera a true para indicar que ya tenemos conexión
    isConeted = false;

    console.log('Desconexión de MongoDB correctamente');
  } catch (error) {
    console.log('Error al desconectarse de MongoDB', error);
  }
};
