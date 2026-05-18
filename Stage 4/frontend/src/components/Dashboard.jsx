import { useState, useEffect } from 'react';
import API from '../api/axios';

function Dashboard() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  useEffect(() => {
    const url = role === 'admin' ? '/centers/all' : '/centers';
    API.get(url)
      .then(res => {
        setCenters(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [role]);

  const handleApprove = async (id) => {
    try {
      await API.patch(`/centers/${id}/approve`);
      setSuccess('✅ Center approved!');
      setCenters(centers.map(c => c.id === id ? {...c, approved: true} : c));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/centers/${id}`);
      setSuccess('🗑️ Center deleted!');
      setCenters(centers.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCenter = async (e) => {
    e.preventDefault();
    try {
      await API.post('/centers', { name, location, description });
      setSuccess('🎉 Center added successfully! Waiting for admin approval.');
      setShowForm(false);
      setName('');
      setLocation('');
      setDescription('');
      if (role === 'admin') {
        const res = await API.get('/centers/all');
        setCenters(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (role === 'admin') {
    return (
      <div className="dashboard-page">
        <h1>🛡️ Admin Panel</h1> 
        {success && <p style={{color: 'green', marginBottom: '15px'}}>{success}</p>}

        <button onClick={() => setShowForm(!showForm)} style={{marginBottom: '20px'}}>
          ➕ Add New Center
        </button>

        {showForm && (
          <form onSubmit={handleAddCenter} className="form-container" style={{marginBottom: '30px'}}>
            <input
              type="text"
              placeholder="Center Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Center</button>
          </form>
        )}

        {loading ? <div className="loader"></div> : (
          <div className="dashboard-cards">
            {centers.map((center, index) => (
              <div key={index} className="dashboard-box">
                <h2>{center.name}</h2>
                <p>{center.location}</p>
                <p>{center.description}</p>
                <p style={{color: center.approved ? 'green' : 'orange', fontWeight: 'bold'}}>
                  {center.approved ? '✅ Approved' : '⏳ Pending'}
                </p>
                {!center.approved && (
                  <button onClick={() => handleApprove(center.id)} style={{marginRight: '10px'}}>
                    ✅ Approve
                  </button>
                )}
                <button onClick={() => handleDelete(center.id)} style={{background: 'linear-gradient(135deg, #f44336, #d32f2f)'}}>
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (role === 'center') {
    return (
      <div className="dashboard-page">
        <h1>🏫 Center Portal</h1>
        {success && <p style={{color: 'green', marginBottom: '15px'}}>{success}</p>}

        <button onClick={() => setShowForm(!showForm)} style={{marginBottom: '20px'}}>
          ➕ Add My Center
        </button>

        {showForm && (
          <form onSubmit={handleAddCenter} className="form-container" style={{marginBottom: '30px'}}>
            <input
              type="text"
              placeholder="Center Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Add Center</button>
          </form>
        )}

        <p style={{color: '#ff6f00', marginTop: '20px'}}>
          ⚠️ Your center will be visible after admin approval.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1>👤 My Account</h1> 
      <p>Manage your account here.</p>
    </div>
  );
}

export default Dashboard;