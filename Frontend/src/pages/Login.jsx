import React from 'react';
import LoginForm from '../components/LoginForm';

const Login = ({ onLogin }) => {
  return <LoginForm onLogin={onLogin} />;
};

export default Login;