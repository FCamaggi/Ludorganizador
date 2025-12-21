import React, { useState } from 'react';
import { Dice6, Lock, User as UserIcon, Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';
import { AuthUser } from '../../types';
import * as api from '../../services/apiService';
import { useTheme } from '../../contexts/ThemeContext';
import { getTheme } from '../../constants';

interface AuthFormProps {
  onComplete: (user: AuthUser) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onComplete }) => {
  const { theme: themeMode, toggleTheme } = useTheme();
  const theme = getTheme(themeMode === 'dark');

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let authUser: AuthUser;
      if (isLogin) {
        authUser = await api.login(username, password);
      } else {
        if (password.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        if (password !== confirmPassword) {
          throw new Error('Las contraseñas no coinciden');
        }
        authUser = await api.register(name, username, password);
      }
      onComplete(authUser);
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: theme.bg.primary }}
    >
      <div
        className="p-8 rounded-2xl shadow-xl max-w-md w-full border relative"
        style={{
          backgroundColor: theme.bg.elevated,
          borderColor: theme.border.light,
        }}
      >
        {/* Toggle de tema */}
        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 p-2 rounded-lg transition-all"
          style={{
            backgroundColor: theme.bg.tertiary,
            color: theme.text.secondary,
          }}
          title={themeMode === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        >
          {themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FFBC0A] to-[#EC7D10] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Dice6 size={32} />
          </div>
          <h1
            className="text-2xl font-bold"
            style={{ color: theme.text.primary }}
          >
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="mt-2" style={{ color: theme.text.secondary }}>
            {isLogin
              ? 'Accede a Ludorganizador'
              : 'Únete a la comunidad de jugadores'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.primary }}
              >
                Nombre / Nickname
              </label>
              <div className="relative">
                <UserIcon
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.text.tertiary }}
                />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
                  style={{
                    backgroundColor: theme.bg.primary,
                    borderColor: theme.border.medium,
                    color: theme.text.primary,
                  }}
                  placeholder="Tu nombre o apodo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.primary }}
            >
              {isLogin ? 'Nombre de Usuario' : 'Nombre de Usuario (único)'}
            </label>
            <div className="relative">
              <UserIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.text.tertiary }}
              />
              <input
                type="text"
                required
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
                style={{
                  backgroundColor: theme.bg.primary,
                  borderColor: theme.border.medium,
                  color: theme.text.primary,
                }}
                placeholder="username123"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: theme.text.primary }}
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: theme.text.tertiary }}
              />
              <input
                type="password"
                required
                minLength={6}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
                style={{
                  backgroundColor: theme.bg.primary,
                  borderColor: theme.border.medium,
                  color: theme.text.primary,
                }}
                placeholder={isLogin ? 'Tu contraseña' : 'Mínimo 6 caracteres'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: theme.text.primary }}
              >
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.text.tertiary }}
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-[#FC2F00] focus:border-[#FC2F00] outline-none transition-all"
                  style={{
                    backgroundColor: theme.bg.primary,
                    borderColor: theme.border.medium,
                    color: theme.text.primary,
                  }}
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-3 text-lg"
            disabled={loading}
          >
            {loading
              ? 'Procesando...'
              : isLogin
              ? 'Iniciar Sesión'
              : 'Crear Cuenta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-[#FC2F00] hover:text-[#D42800] text-sm font-medium"
          >
            {isLogin
              ? '¿No tienes cuenta? Regístrate'
              : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
