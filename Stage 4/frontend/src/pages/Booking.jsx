function Booking() {
  return (
    <div className="booking-page">
      <h1>Book a Center</h1>

      <form className="form-container">
        <input type="text" placeholder="Child Name" />

        <input type="text" placeholder="Parent Name" />

        <input type="date" />

        <select>
          <option>Creative Kids Center</option>
          <option>Future Coders Academy</option>
          <option>Young Scientists Lab</option>
        </select>

        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default Booking;