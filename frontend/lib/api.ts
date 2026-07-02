// frontend/lib/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109/api/game/v1';

// Tipos de datos para el registro
export type RegisterData = {
  firstname: string;
  lastname: string;
  age: number;
  email: string;
  password: string;
};

// 1. Endpoint: Login
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok && data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return { ok: response.ok, data };
};

// 2. Endpoint: Registro
export const registerUser = async (userData: RegisterData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  
  if (response.ok && data.token) {
    localStorage.setItem('token', data.token);
  }
  
  return { ok: response.ok, data };
};

// 3. Endpoint: Iniciar Partida
export const startGame = async () => {
  const response = await fetch(`${API_BASE_URL}/start`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  });
  
  return { ok: response.ok, data: await response.json() };
};

// 4. Endpoint: Adivinar (Guess)
export const guessNumber = async (gameId: number, attemptedNumber: string) => {
  const response = await fetch(`${API_BASE_URL}/guess`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gameId, attemptedNumber: Number(attemptedNumber) })
  });
  
  return { ok: response.ok, data: await response.json() };
};