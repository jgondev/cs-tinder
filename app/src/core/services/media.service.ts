// Importa todas las rutas dentro de assets
const allAssets: Record<string, { default: string }> = import.meta.glob(
    '../../assets/**/*',
    { eager: true }
);

export const getLevelImage = (level: number): string => {
    const path = `../../assets/faceit/lvl${level}.svg`;
    return allAssets[path]?.default || ''; // Devuelve la imagen o una cadena vacía si no existe
};

export const getAsset = (path: string): string => {
    const fullPath = `../../assets${path}`; // Elimina la barra inicial de path
    return allAssets[fullPath]?.default || ''; // Devuelve la ruta válida o una cadena vacía
};

