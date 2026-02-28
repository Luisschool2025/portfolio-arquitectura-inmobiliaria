# Arquitectura de Plataforma Inmobiliaria Escalable & Segura

![Status](https://img.shields.io/badge/STATUS-PRODUCTION-success?style=for-the-badge)
![Security](https://img.shields.io/badge/SECURITY-A%2B-blue?style=for-the-badge)
![Stack](https://img.shields.io/badge/STACK-NEXT.JS_15_%7C_SUPABASE-black?style=for-the-badge)

> **Desarrollado por:** Especialista en Ciberseguridad (Ceduc UCN) & Infraestructura TI (GTEI).
> **Enfoque:** Este proyecto demuestra cómo integrar principios de **DevSecOps** y **Eficiencia de Hardware** en el desarrollo de software moderno.

---

## 🏗️ La 'Visión de Capas': Del Rack al Browser

A diferencia de un desarrollo web estándar, esta plataforma fue diseñada con una comprensión profunda de la infraestructura subyacente. No es solo código; es una gestión eficiente de recursos computacionales y de red.

*   **Capa Física/Red (Infraestructura):** Optimización de latencia y ancho de banda mediante CDN (Cloudflare) y almacenamiento en el Edge (R2/S3 compatible). Estrategia "Egress-Zero" para minimizar costos de transferencia de datos en Data Centers.
*   **Capa de Datos (PostgreSQL):** Modelado relacional estricto con índices compuestos estratégicos para evitar *Full Table Scans* y reducir la carga de CPU/IOPS en el servidor de base de datos.
*   **Capa de Aplicación (Next.js):** Renderizado Híbrido (ISR/SSR) para equilibrar la carga del servidor y la velocidad del cliente. Seguridad aplicada en headers HTTP.

---

## 🛡️ Desafíos Técnicos Resueltos

### 1. Seguridad (DevSecOps) & Hardening
Implementación de una postura de seguridad defensiva en profundidad:
*   **Content Security Policy (CSP) Estricta:** [Ver configuración](next.config.ts). Se bloquean preventivamente todos los orígenes no autorizados de scripts, estilos e iframes, mitigando XSS y Clickjacking.
*   **Row Level Security (RLS):** "Firewall de Base de Datos". Ninguna consulta SQL se ejecuta sin pasar por una política de acceso validada criptográficamente (JWT).
*   **Saneamiento de Inputs:** Validación estricta de tipos MIME en el cliente y servidor para prevenir subidas maliciosas.

### 2. Rendimiento & Database Tuning
Optimización para tiempos de respuesta <100ms:
*   **Índices Compuestos:** [Ver migración SQL](supabase/migrations/20260228_add_strategic_indexes.sql). Creación de índices específicos (`idx_properties_active_recent`) que cubren las consultas más frecuentes (filtrado + ordenamiento), permitiendo `Index Only Scans`.
*   **Full-Text Search (FTS):** Implementación de motor de búsqueda nativo en PostgreSQL con diccionarios en español y ponderación de relevancia (`tsvector`), eliminando la necesidad de servicios externos como Algolia.

### 3. Optimización de Recursos (Cost-Efficiency)
Estrategia de **"Egress-Zero"** para video y multimedia:
*   **YouTube First:** [Ver lógica de subida](uploadLogic_SHOWCASE.ts). Se prohíbe la subida de archivos de video pesados al storage propio. Se fuerza el uso de plataformas de streaming especializadas, ahorrando TBs de ancho de banda y almacenamiento.
*   **Compresión Cliente:** Las imágenes se procesan y comprimen (WebP) en el navegador del usuario *antes* de la subida, reduciendo el uso de red en un 70%.
*   **Caché Inmutable:** Configuración de headers `Cache-Control: immutable` para assets estáticos, maximizando el hit-rate en la CDN.

---

## 🌐 Infraestructura y Despliegue

El sistema está diseñado para ser agnóstico del proveedor pero optimizado para el Edge:
*   **Hosting:** Compatible con contenedores Docker (Render) o Serverless (Vercel).
*   **Database:** PostgreSQL gestionado (Supabase) con pooling de conexiones (PgBouncer) para manejar picos de concurrencia.
*   **CI/CD:** Despliegues atómicos basados en Git, con migraciones de base de datos automatizadas.

---

> **⚠️ Disclaimer Profesional:** 
> Este repositorio es un **Showcase Técnico** (Portafolio) que contiene fragmentos clave de arquitectura y configuración. El código fuente completo, lógica de negocio propietaria y credenciales han sido omitidos para proteger la Propiedad Intelectual y la seguridad del sistema en producción.
