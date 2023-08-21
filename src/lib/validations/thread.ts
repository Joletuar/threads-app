import * as z from 'zod';

// Creamos el esquema de validaciones para el formulario del threads

export const ThreadValidation = z.object({
  thread: z.string().nonempty().min(3, { message: 'Mínimo 3 caracteres' }),
  accountId: z.string(),
});

// Creamos el esquema de validaciones para los comentarios

export const CommentValidation = z.object({
  thread: z.string().nonempty().min(3, { message: 'Mínimo 3 caracteres' }),
});
