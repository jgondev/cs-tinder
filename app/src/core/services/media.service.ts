// /src/core/services/media.service.ts
const levelImages: Record<string, { default: string }> = import.meta.glob(
    '../../assets/faceit/lvl*.svg',
    { eager: true }
);

/**
 * Obtiene la ruta de la imagen correspondiente al nivel del jugador.
 * @param level Nivel del jugador
 * @returns Ruta de la imagen
 */
export const getLevelImage = (level: number): string => {
    const path = `../../assets/faceit/lvl${level}.svg`;
    return levelImages[path]?.default || ''; // Devuelve la imagen o una cadena vacía si no existe
};
