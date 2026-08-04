/** Префикс базового пути для статики из public/ — чтобы сборка работала и в корне
 *  (workers.dev), и в подкаталоге (GitHub Pages: /unicard-demo/). */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '')
