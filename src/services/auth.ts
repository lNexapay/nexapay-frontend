import type { Usuario } from '../context/UsuarioContext'

const API_URL = import.meta.env.VITE_API_URL

// Forma en que el backend devuelve al usuario
type UsuarioBack = {
  id: string
  name: string
  email: string
}

type RespuestaRegistro = {
  message: string
  user: UsuarioBack
}

type RespuestaLogin = {
  message: string
  token: string
  user: UsuarioBack
}

// Traducimos los nombres del back (name) a los del front (nombre)
function aUsuario(user: UsuarioBack): Usuario {
  return { nombre: user.name, email: user.email }
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

  return aUsuario((data as RespuestaRegistro).user)
}

export async function loginUsuario(
  email: string,
  password: string,
): Promise<{ usuario: Usuario; token: string }> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    if (res.status === 401) throw new Error('Email o contraseña incorrectos.')
    if (res.status === 400) throw new Error('Completá tu email y tu contraseña.')
    throw new Error(data?.message ?? 'No se pudo iniciar sesión. Probá de nuevo.')
  }

  const respuesta = data as RespuestaLogin
  return { usuario: aUsuario(respuesta.user), token: respuesta.token }
}

export async function logoutUsuario(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
  } catch {
    // Si el back no responde, igual cerramos la sesión en el front
  }
}