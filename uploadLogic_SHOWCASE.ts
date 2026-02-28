/**
 * Nota: En la aplicación real se utiliza 'sonner' para notificaciones.
 * Para este showcase, se desacopla la lógica de la librería de UI.
 */
const toast = {
  error: (msg: string) => console.error(`[Security Alert]: ${msg}`),
  success: (msg: string) => console.log(`[Success]: ${msg}`),
};
import imageCompression from "browser-image-compression";

/**
 * SHOWCASE: Lógica de Validación y Subida Segura
 * 
 * Este módulo demuestra la política de "Egress-Zero" y "Strict Media Types".
 * Objetivo: Evitar costos de ancho de banda y almacenamiento innecesarios.
 */

// Configuración centralizada de límites
const UPLOAD_POLICY = {
  maxSizeMB: 50,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
  videoProvider: "youtube", // Forzamos providers externos
};

/**
 * Validador estricto que actúa como primera línea de defensa en el cliente.
 * Rechaza inmediatamente archivos de video para proteger el storage.
 */
export const validateUploadCandidate = (file: File): { valid: boolean; error?: string } => {
  // 1. Candado de Video (Security Policy)
  if (file.type.startsWith("video/")) {
    return {
      valid: false,
      error: "⚠️ POLÍTICA DE SEGURIDAD: Los videos deben alojarse en YouTube para optimizar el streaming. Por favor sube solo imágenes.",
    };
  }

  // 2. Validación de Tipo MIME (Allowlist)
  if (!UPLOAD_POLICY.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Formato no permitido. Use: ${UPLOAD_POLICY.allowedMimeTypes.join(", ")}`,
    };
  }

  // 3. Validación de Tamaño (Resource Protection)
  const fileSizeMB = file.size / 1024 / 1024;
  if (fileSizeMB > UPLOAD_POLICY.maxSizeMB) {
    return {
      valid: false,
      error: `El archivo excede el límite de ${UPLOAD_POLICY.maxSizeMB}MB.`,
    };
  }

  return { valid: true };
};

/**
 * Lógica de optimización de imágenes (Client-side)
 * Filosofía Egress-Zero: Procesar antes de enviar a la red.
 */
export const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1.5,           // Target size agresivo
    maxWidthOrHeight: 1920,  // Full HD es suficiente para web
    useWebWorker: true,      // No bloquear el hilo principal
    fileType: "image/webp"   // Forzar formato moderno
  };

  try {
    console.log(`[Compression] Iniciando optimización de ${file.name} (${(file.size/1024/1024).toFixed(2)}MB)`);
    // Nota: 'imageCompression' debe estar importado de 'browser-image-compression'
    const compressedFile = await imageCompression(file, options);
    console.log(`[Compression] Resultado: ${(compressedFile.size/1024/1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error("Error en compresión:", error);
    return file; // Fallback al original si falla
  }
};

/**
 * Ejemplo de uso en componente React
 */
export const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const optimizedFile = await compressImage(file);
    console.log("Archivo listo para subir:", optimizedFile.name);
    // Aquí iría tu lógica de subida a Supabase
  } catch (err) {
    console.error("Fallo en la cadena de procesamiento:", err);
  }
}; // <-- Aquí faltaba cerrar la llave
  