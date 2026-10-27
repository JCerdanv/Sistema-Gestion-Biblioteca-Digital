// jncv dia (11c)

// orden de ejecucion            npx tsx index.ts
import express from 'express';
import type { Request, Response } from "express";

const app = express();
app.use(express.json());

// Interfaz del Libro
interface Libro {
  id: number;
  titulo: string;
  autor: string;
  paginas: number;
  disponible: boolean;
}

// Base de datos en memoria - autores peruanos
let libros: Libro[] = [
  { id: 1, titulo: "Tradiciones Peruanas", autor: "Ricardo Palma", paginas: 486, disponible: true },
  { id: 2, titulo: "Los heraldos negros", autor: "César Vallejo", paginas: 370, disponible: false },
  { id: 3, titulo: "El mundo es ancho y ajeno", autor: "Ciro Alegría", paginas: 184, disponible: true },
  { id: 4, titulo: "La ciudad y los perros", autor: "Mario Vargas Llosa", paginas: 243, disponible: false }
];

// Contador para generar IDs únicos de forma incremental
let proximoId = 5;

// --- ENDPOINTS ---

// 1. GET /api/libros - Listar todos los libros
app.get('/api/libros', (req: Request, res: Response) => {
  res.status(200).json(libros);
});

// 2. GET /api/libros/:id - Buscar un libro específico por su ID
app.get('/api/libros/:id', (req: Request, res: Response) => {
  const idBuscar = parseInt(req.params.id?.toString() ?? '');
  const libro = libros.find(l => l.id === idBuscar);
  
  if (!libro) {
    return res.status(404).json({ mensaje: `Libro ID ${idBuscar} no encontrado.` });
  }
  
  res.status(200).json(libro);
});

// 3. POST /api/libros - Registrar un nuevo libro
app.post('/api/libros', (req: Request, res: Response) => {
  const { titulo, autor, paginas, disponible } = req.body;

  // Validación estricta de campos obligatorios
  if (!titulo || !autor || paginas === undefined || disponible === undefined) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios (titulo, autor, paginas, disponible)." });
  }

  const nuevoLibro: Libro = {
    id: proximoId++,
    titulo,
    autor,
    paginas: Number(paginas),
    disponible: Boolean(disponible)
  };

  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);
});



// 4. PUT /api/libros/:id - Actualizar un libro existente por ID
app.put('/api/libros/:id', (req: Request, res: Response) => {
  const idEditar = parseInt(req.params.id?.toString() ?? '');
  const indice = libros.findIndex(l => l.id === idEditar);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No se pudo actualizar. Libro ID ${idEditar} no encontrado.` });
  }

  const { titulo, autor, paginas, disponible } = req.body;

  // Validación estricta de campos obligatorios para reemplazo total (PUT)
  if (!titulo || !autor || paginas === undefined || disponible === undefined) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos para actualizar (titulo, autor, paginas, disponible)." });
  }

  // Actualizar el registro manteniendo el mismo ID original
  libros[indice] = {
    id: idEditar,
    titulo,
    autor,
    paginas: Number(paginas),
    disponible: Boolean(disponible)
  };

  res.status(200).json({ mensaje: "Libro actualizado con exito.", libro: libros[indice] });
});



// 5. DELETE /api/libros/:id - Eliminar un libro por ID
app.delete('/api/libros/:id', (req: Request, res: Response) => {
  const idEliminar = parseInt(req.params.id?.toString() ?? '');
  const indice = libros.findIndex(l => l.id === idEliminar);

  if (indice === -1) {
    return res.status(404).json({ mensaje: `No se pudo eliminar. Libro ID ${idEliminar} no encontrado.` });
  }

  const libroEliminado = libros.splice(indice, 1);
  res.status(200).json({ mensaje: "Libro eliminado con exito.", libro: libroEliminado[0] });
});



// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// jncv dia (11c) - Fin del código servidor Express con TypeScript gestión de libros peruanos.

