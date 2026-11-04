import type { Usuario } from '../context/UsuarioContext'
import { pedir, ErrorApi } from './api'

// Forma en que el backend devuelve al usuario
type UsuarioBack = {
  id: string
  name: string
  email: string
  accountNumber?: string | number
  account_number?: string | number
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

type RespuestaRefresh = {
  token: string
}

type RespuestaMe = {
  user: UsuarioBack
}

// Traducimos los nombres del back a los del front
function aUsuario(user: UsuarioBack): Usuario {
  const cuenta = user.accountNumber ?? user.account_number
  return {
    nombre: user.name,
    email: user.email,
    cuenta: cuenta !== undefined ? String(cuenta) : undefined,
  }
}

export async function registrarUsuario(
  nombre: string,
  email: string,
  password: string,
): Promise<Usuario> {
  try {
    const data = await pedir<RespuestaRegistro>('/api/auth/register', null, {
      method: 'POST',
      body: JSON.stringify({ name: nombre, email, password }),
    })
    return aUsuario(data.user)
  } catch (err) {
    if (err instanceof ErrorApi) {
      if (err.status === 409) throw new Error('Ese email ya está registrado.')
      if (err.status === 400) {
        throw new Error('Revisá los datos. La contraseña debe tener al menos 8 caracteres.')
      }
    }
    throw err
  }
}

export async function loginUsuario(
  email: string,
  password: string,
): Promise<{ usuario: Usuario; token: string }> {
  try {
    const data = await pedir<RespuestaLogin>('/api/auth/login', null, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return { usuario: aUsuario(data.user), token: data.token }
  } catch (err) {
    if (err instanceof ErrorApi) {
      if (err.status === 401) throw new Error('Email o contraseña incorrectos.')
      if (err.status === 400) throw new Error('Completá tu email y tu contraseña.')
    }
    throw err
  }
}

// Inicia sesión con el comprobante (idToken) que entrega Google
export async function loginConGoogle(
  idToken: string,
): Promise<{ usuario: Usuario; token: string }> {
  const data = await pedir<RespuestaLogin>('/api/auth/google', null, {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  })
  return { usuario: aUsuario(data.user), token: data.token }
}

export async function logoutUsuario(): Promise<void> {
  try {
    await pedir('/api/auth/logout', null, { method: 'POST' })
  } catch {
    // Si el back no responde, igual cerramos la sesión en el front
  }
}

// Pide un token nuevo usando la cookie refreshToken (no necesita datos)
export async function renovarSesion(): Promise<string> {
  const data = await pedir<RespuestaRefresh>('/api/auth/refresh', null, { method: 'POST' })
  return data.token
}

// Trae los datos del usuario logueado (ruta protegida: necesita el token)
export async function obtenerUsuarioActual(token: string): Promise<Usuario> {
  const data = await pedir<RespuestaMe>('/api/auth/me', token)
  return aUsuario(data.user)
}