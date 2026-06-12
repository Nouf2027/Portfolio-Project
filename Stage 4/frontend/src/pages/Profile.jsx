import React, { useState, useEffect } from "react";
import API from "../api/axios";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [bookings, setBookings] = useState([]);
  const [centerData, setCenterData] = useState(null);
  const [centerBookings, setCenterBookings] = useState([]);
  const [centerCourses, setCenterCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    if (role === "parent") {
      API.get("/bookings/me").then(res => setBookings(res.data)).catch(() => {});
    }
    if (role === "center") {
      API.get("/centers/mine").then(res => {
        setCenterData(res.data);
        if (res.data?.id) {
          API.get(`/centers/${res.data.id}/courses`).then(r => setCenterCourses(r.data)).catch(() => {});
        }
      }).catch(() => {});
      API.get("/bookings/center").then(res => setCenterBookings(res.data)).catch(() => {});
    }
    if (role === "admin") {
      API.get("/auth/users").then(res => setUsers(res.data)).catch(() => {});
      API.get("/centers/all").then(res => setCenters(res.data)).catch(() => {});
    }
  }, [role]);

  const handleCancelBooking = async (id) => {
    try {
      await API.delete(`/bookings/${id}`);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  return (
    <div style={{display:'flex', minHeight:'100vh', background:'#f0f4f8'}}>

      {/* Sidebar */}
      <div style={{width:'220px', background:'#3b5b7a', color:'white', padding:'30px 20px', display:'flex', flexDirection:'column', gap:'10px', minHeight:'100vh'}}>
        <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
          <span style={{fontSize:'28px'}}>🌱</span>
          <span style={{fontSize:'24px', fontWeight:'800', color:'white'}}>Jeel</span>
        </div>
        <a href="/" style={{color:'white', textDecoration:'none', padding:'10px 14px', borderRadius:'10px', background:'rgba(255,255,255,0.15)'}}>🏠 Home</a>
        <a href="/search" style={{color:'white', textDecoration:'none', padding:'10px 14px', borderRadius:'10px'}}>🔍 Centers</a>
        {role === "center" && <a href="/dashboard" style={{color:'white', textDecoration:'none', padding:'10px 14px', borderRadius:'10px'}}>📊 Dashboard</a>}
        {role === "admin" && <a href="/dashboard" style={{color:'white', textDecoration:'none', padding:'10px 14px', borderRadius:'10px'}}>🛡️ Admin</a>}
        <a href="/profile" style={{color:'white', textDecoration:'none', padding:'10px 14px', borderRadius:'10px', background:'rgba(255,255,255,0.15)'}}>👤 Profile</a>
        <div style={{marginTop:'auto'}}>
          <a href="/login" onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); }} style={{color:'white', textDecoration:'none', padding:'10px 14px', borderRadius:'10px', display:'block'}}>🚪 Logout</a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{flex:1, padding:'30px'}}>

        {/* Hero */}
        <div style={{background:'#3b5b7a', borderRadius:'20px', padding:'30px', color:'white', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
          <div>
            <h1 style={{color:'white', fontSize:'28px', marginBottom:'8px'}}>Welcome back, {user?.name} 👋</h1>
            <p style={{color:'rgba(255,255,255,0.8)', marginBottom:'12px'}}>Here's what's happening with your account today.</p>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
              <span style={{background:'rgba(255,255,255,0.15)', padding:'6px 14px', borderRadius:'20px', fontSize:'14px'}}>✉️ {user?.email}</span>
              <span style={{background:'#ff9800', padding:'6px 14px', borderRadius:'20px', fontSize:'14px', fontWeight:'600'}}>{role}</span>
            </div>
          </div>
          <div style={{width:'80px', height:'80px', background:'rgba(255,255,255,0.9)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'40px'}}>
            👤
          </div>
        </div>

        {/* Cards Grid */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px'}}>

          {/* My Profile Card */}
          <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0'}}>
            <h2 style={{color:'#3b5b7a', marginBottom:'16px'}}>👤 My Profile</h2>
            <p style={{marginBottom:'8px'}}><strong>Name:</strong> {user?.name}</p>
            <p style={{marginBottom:'8px'}}><strong>Email:</strong> {user?.email}</p>
            <p style={{marginBottom:'16px'}}><strong>Role:</strong> {user?.role}</p>
            {role !== "admin" && (
              <button style={{background:'#ff9800', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer', marginRight:'8px'}}>Edit Profile</button>
            )}
          </div>

          {/* Parent Bookings */}
          {role === "parent" && (
            <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', gridColumn:'span 2'}}>
              <h2 style={{color:'#3b5b7a', marginBottom:'16px'}}>📚 My Bookings</h2>
              {bookings.length === 0 ? (
                <div style={{textAlign:'center', padding:'20px', color:'#94a3b8'}}>
                  <h3>No bookings yet</h3>
                  <p>Start exploring centers and book your first course.</p>
                  <a href="/search" style={{color:'#ff9800', fontWeight:'600'}}>Find Centers →</a>
                </div>
              ) : (
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'12px'}}>
                  {bookings.map((booking) => (
                    <div key={booking.id} style={{background:'#f8faff', borderRadius:'12px', padding:'16px', border:'1px solid #d6e6f5'}}>
                      <h3 style={{color:'#3b5b7a', marginBottom:'8px'}}>{booking.course_name}</h3>
                      <p>🏫 {booking.center_name}</p>
                      <p>📅 {new Date(booking.date).toLocaleDateString()}</p>
                      <p>🔄 {booking.status}</p>
                      <button onClick={() => handleCancelBooking(booking.id)}
                        style={{marginTop:'10px', background:'#ff4444', color:'white', border:'none', padding:'8px 16px', borderRadius:'8px', cursor:'pointer', width:'100%'}}>
                        ❌ Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Center Cards */}
          {role === "center" && (
            <>
              {centerBookings.length > 0 && (
                <div style={{background:'#fff3e0', padding:'12px 20px', borderRadius:'12px', border:'2px solid #ffb74d', gridColumn:'span 3'}}>
                  🔔 <strong>You have {centerBookings.length} new booking(s)!</strong>
                </div>
              )}
              <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0'}}>
                <h2 style={{color:'#3b5b7a', marginBottom:'16px'}}>🏫 Center Profile</h2>
                {centerData ? (
                  <>
                    <p><strong>Name:</strong> {centerData.name}</p>
                    <p><strong>Location:</strong> {centerData.location}</p>
                    <p><strong>Status:</strong> <span style={{color: centerData.approved ? 'green' : 'orange'}}>{centerData.approved ? "Approved ✅" : "Pending ⏳"}</span></p>
                    <a href="/dashboard" style={{color:'#ff9800', fontWeight:'600', display:'block', marginTop:'10px'}}>⚙️ Manage Center →</a>
                  </>
                ) : (
                  <div style={{textAlign:'center', color:'#94a3b8'}}>
                    <p>No center registered yet</p>
                    <a href="/dashboard" style={{color:'#ff9800', fontWeight:'600'}}>Register your center →</a>
                  </div>
                )}
              </div>

              <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0'}}>
                <h2 style={{color:'#3b5b7a', marginBottom:'16px'}}>📚 My Courses</h2>
                {centerCourses.length === 0 ? (
                  <p style={{color:'#94a3b8'}}>No courses yet.</p>
                ) : (
                  centerCourses.map(course => (
                    <div key={course.id} style={{background:'#f8faff', borderRadius:'12px', padding:'12px', border:'1px solid #d6e6f5', marginBottom:'8px'}}>
                      <h3 style={{color:'#3b5b7a'}}>{course.name}</h3>
                      <p>💰 {course.price} SAR · ⏱️ {course.duration}</p>
                    </div>
                  ))
                )}
              </div>

              <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0'}}>
                <h2 style={{color:'#3b5b7a', marginBottom:'16px'}}>📅 Center Bookings</h2>
                {centerBookings.length === 0 ? (
                  <p style={{color:'#94a3b8'}}>No bookings yet.</p>
                ) : (
                  centerBookings.map((booking) => (
                    <div key={booking.id} style={{background:'#f8faff', borderRadius:'12px', padding:'12px', border:'1px solid #d6e6f5', marginBottom:'8px'}}>
                      <h3 style={{color:'#3b5b7a'}}>{booking.course_name}</h3>
                      <p>👤 {booking.email} · 📅 {new Date(booking.date).toLocaleDateString()}</p>
                      <p>🔄 {booking.status}</p>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Admin Cards */}
          {role === "admin" && (
            <>
              <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', textAlign:'center'}}>
                <h2 style={{color:'#3b5b7a'}}>👥 Total Users</h2>
                <h1 style={{fontSize:'48px', color:'#ff9800'}}>{users.length}</h1>
              </div>
              <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', textAlign:'center'}}>
                <h2 style={{color:'#3b5b7a'}}>🏫 Total Centers</h2>
                <h1 style={{fontSize:'48px', color:'#ff9800'}}>{centers.length}</h1>
              </div>
              <div style={{background:'white', borderRadius:'16px', padding:'24px', boxShadow:'0 4px 15px rgba(0,0,0,0.06)', border:'1px solid #e2e8f0', textAlign:'center'}}>
                <h2 style={{color:'#3b5b7a'}}>⏳ Pending</h2>
                <h1 style={{fontSize:'48px', color:'#ff9800'}}>{centers.filter(c => !c.approved).length}</h1>
                <a href="/dashboard" style={{color:'#ff9800', fontWeight:'600'}}>Admin Dashboard →</a>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Profile;
