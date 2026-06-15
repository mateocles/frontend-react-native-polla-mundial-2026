import * as ImageManipulator from "expo-image-manipulator";

// Tamaño aproximado en bytes de un string base64.
const base64Bytes = (b64) => Math.ceil((b64.length * 3) / 4);

const manipulate = (uri, width, quality) =>
  ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width } }],
    { compress: quality, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

/**
 * Comprime una imagen a un data URI base64 liviano.
 * Redimensiona a `maxWidth` y, si sigue pesando más de `maxBytes`,
 * reduce calidad y ancho en iteraciones hasta cumplir el objetivo.
 *
 * @returns {Promise<{ uri: string, bytes: number }>}
 */
export async function compressToBase64(
  uri,
  { maxWidth = 800, maxBytes = 200 * 1024, minWidth = 200, minQuality = 0.2 } = {}
) {
  let width = maxWidth;
  let quality = 0.6;
  let result = await manipulate(uri, width, quality);
  let attempts = 0;

  while (base64Bytes(result.base64) > maxBytes && attempts < 6) {
    attempts += 1;
    quality = Math.max(minQuality, quality - 0.12);
    width = Math.max(minWidth, Math.round(width * 0.82));
    result = await manipulate(uri, width, quality);
    // Si ya estamos en el mínimo de ambos, no tiene sentido seguir.
    if (width === minWidth && quality === minQuality) break;
  }

  return {
    uri: `data:image/jpeg;base64,${result.base64}`,
    bytes: base64Bytes(result.base64),
  };
}
