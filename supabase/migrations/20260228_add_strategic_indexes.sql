-- ESTRUCTURA ACTUAL (Deducida):
-- properties (id, title, description, address, city, kind, type, price, image_url, video_url, is_paused, created_at, fts)
-- property_images (id, property_id, image_url)

-- 1. ÍNDICES PARA FILTROS FRECUENTES (Búsqueda exacta e ILIKE)
-- Optimiza filtros por ciudad, tipo de operación y tipo de propiedad
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties (type);
CREATE INDEX IF NOT EXISTS idx_properties_kind ON properties (kind);

-- 2. ÍNDICE PARA RANGOS DE PRECIO
-- Optimiza filtros de precio y ordenamiento por valor
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties (price);

-- 3. ÍNDICE PARA ESTADO DE VISIBILIDAD (CRÍTICO)
-- Optimiza la carga de la página pública donde is_paused = false es constante
CREATE INDEX IF NOT EXISTS idx_properties_is_paused ON properties (is_paused);

-- 4. ÍNDICE PARA ORDENAMIENTO Y PAGINACIÓN (CRÍTICO)
-- Optimiza la carga de "Cargar más" y orden por fecha de creación
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties (created_at DESC);

-- 5. ÍNDICE COMPUESTO PARA VISTA PÚBLICA (ESTRATEGIA PRO)
-- Optimiza la consulta más común: propiedades activas ordenadas por fecha
CREATE INDEX IF NOT EXISTS idx_properties_active_recent ON properties (is_paused, created_at DESC) WHERE is_paused = false;

-- 6. ÍNDICE PARA RELACIONES (PERFORMANCE DE CARGA DE DETALLE)
-- Optimiza el JOIN/Select de imágenes al abrir una propiedad
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images (property_id);

-- 7. ÍNDICE PARA BÚSQUEDA DE TEXTO (FTS)
-- Si la columna fts ya existe para Full Text Search
CREATE INDEX IF NOT EXISTS idx_properties_fts ON properties USING gin (fts);
