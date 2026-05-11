import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', email, password);
  };

  return (
    <div className="login-page">
      <form className="login-form">
        <h2>Login</h2>

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

        <button>Login</button>
      </form>
    </div>
  );
}

export default Login;