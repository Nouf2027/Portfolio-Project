function Dashboard() {
  return (
    <div className="dashboard-page">
      <h1>Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-box">
          <h2>3</h2>
          <p>Available Centers</p>
        </div>

        <div className="dashboard-box">
          <h2>2</h2>
          <p>Bookings</p>
        </div>

        <div className="dashboard-box">
          <h2>1</h2>
          <p>Pending Requests</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;