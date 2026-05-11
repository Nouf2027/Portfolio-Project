import React, { useState } from 'react';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register:', name, email, password, role);
  };
  return (
    <div className="register-page">
      <form className="register-form">
        <h2>Register</h2>

        <input type="text" placeholder="Name" />

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

        <select>
          <option>Select Account Type</option>
          <option>Parent</option>
          <option>Center Owner</option>
        </select>

        <button>Register</button>
      </form>
    </div>
  );
}

export default Register;