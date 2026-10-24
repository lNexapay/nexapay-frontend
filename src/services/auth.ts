import type { Usuario } from '../context/UsuarioContext'

const API_URL = import.meta.env.VITE_API_URL

// Forma de la respuesta del backend (según docs/AUTH_API.md)
type RespuestaRegistro = {
    message: string
    user: {
        id: string
        name: string
        email: string
        created_at: string
    }
}

export async function registrarUsuario(
    nombre: string,
    email: string,
    password: string,
): Promise<Usuario> {
    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: nombre, email, password }),
    })

    const data = await res.json().catch(() => null)

    if (!res.ok) {
        if (res.status === 409) throw new Error('Ese email ya está registrado.')
        if (res.status === 400) {
            throw new Error('Revisá los datos. La contraseña debe tener al menos 8 caracteres.')
        }
        throw new Error(data?.message ?? 'No se pudo crear la cuenta. Probá de nuevo.')
    }

    const respuesta = data as RespuestaRegistro

    // Traducimos los nombres del back (name) a los del front (nombre)
    return {
        nombre: respuesta.user.name,
        email: respuesta.user.email,
    }
}