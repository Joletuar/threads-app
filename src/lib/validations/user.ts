import * as z from 'zod';

// Creamos el esquema de validaciones para el formulario del usaurio

export const UserValidation = z.object({
  image: z.string().url().nonempty(),
  name: z.string().min(3).max(30),
  username: z.string().min(3).max(50),
  bio: z.string().min(3).max(1000),
});
