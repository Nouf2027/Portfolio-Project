import { useState } from "react";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
const [license, setLicense] = useState(null);
const [editing, setEditing] = useState(false);
  const [centers, setCenters] = useState([
    {
      id: 1,
      name: "Almu Center",
      location: "Riyadh",
      description: "Programming Courses",
      approved: false,
    },
  ]);

  const [center, setCenter] = useState(null);

  const [centerName, setCenterName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
const newCenter = {
  id: Date.now(),
  name: centerName,
  location,
  description,
  approved: false
};
  const handleApprove = (id) => {
    const updatedCenters = centers.map((center) =>
      center.id === id ? { ...center, approved: true } : center
    );

    setCenters(updatedCenters);

    const approvedCenter = updatedCenters.find((center) => center.id === id);
    setCenter(approvedCenter);
  };

  const handleSubmitCenter = (e) => {
    e.preventDefault();
    <p className="pending-text">
⏳ Waiting for admin approval
</p>
const newCenter = {
  id: Date.now(),
  name: centerName,
  location,
  description,
  license: license ? license.name : "No license uploaded",
  approved: false,
};
    if (!centerName || !location || !description) {
      alert("Please fill all fields");
      return;
    }

    setCenters([...centers, newCenter]);
    setCenter(newCenter);

    setCenterName("");
    setLocation("");
    setDescription("");

    alert("Center submitted for admin approval");
  };

  const handleAddCourse = (e) => {
    e.preventDefault();

    if (!courseName || !coursePrice || !courseDuration) {
      alert("Please fill all course fields");
      return;
    }

    const newCourse = {
      id: Date.now(),
      name: courseName,
      price: coursePrice,
      duration: courseDuration,
      students: 0,
    };

    setCourses([...courses, newCourse]);

    setCourseName("");
    setCoursePrice("");
    setCourseDuration("");
  };
return (
  <div className="dashboard-page">

    {/* Admin Dashboard */}
    {role === "admin" && (
      <div>
        <h1>Admin Dashboard</h1>

        <div className="dashboard-cards">

          {centers
            .filter((center) => !center.approved)
            .map((center) => (

              <div key={center.id} className="dashboard-box">

                <h2>{center.name}</h2>

                <p>Location: {center.location}</p>

                <p>{center.description}</p>

                <p>Status: Pending</p>

                <button
                  onClick={() => handleApprove(center.id)}
                >
                  Approve
                </button>

              </div>

          ))}

        </div>
      </div>
    )}

    {/* Center Dashboard */}
    {role !== "admin" && (
      <div>

        <h1>🏫 Center Dashboard</h1>

        {!center && (
          <div className="pending-box">

            <h2>Submit Center Information</h2>

            <form
              onSubmit={handleSubmitCenter}
              className="form-container"
            >

              <input
                placeholder="Center Name"
                value={centerName}
                onChange={(e) =>
                  setCenterName(e.target.value)
                }
              />

              <input
                placeholder="Location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

              <input
                type="file"
                onChange={(e) =>
                  setLicense(e.target.files[0])
                }
              />

              <button type="submit">
                Submit For Approval
              </button>

            </form>

          </div>
        )}

        {center && !center.approved && (
          <div className="pending-box">

            <h2>{center.name}</h2>
<button
  onClick={() => setEditing(true)}
  className="edit-btn"
>
  Edit Profile
</button>
{editing && (

  <div className="edit-box">

    <input
      value={center.name}
      onChange={(e) =>
        setCenter({
          ...center,
          name: e.target.value
        })
      }
    />

    <input
      value={center.location}
      onChange={(e) =>
        setCenter({
          ...center,
          location: e.target.value
        })
      }
    />

    <textarea
      value={center.description}
      onChange={(e) =>
        setCenter({
          ...center,
          description: e.target.value
        })
      }
    />

    <button onClick={() => setEditing(false)}>
      Save Changes
    </button>

  </div>

)}
            <p>⏳ Waiting for admin approval</p>

            <p>Location: {center.location}</p>

            <p>{center.description}</p>

          </div>
        )}

        {center && center.approved && (

         <div className="status-box">

  <h2>{center.name}</h2>

  <p className="pending-status">
    ⏳ Waiting for admin approval
  </p>

  <p>
    Your request is under review.
  </p>
            <h2>Welcome, {center.name}</h2>

            <h3>Add New Course</h3>

            <form
              onSubmit={handleAddCourse}
              className="form-container"
            >

              <input
                placeholder="Course Name"
                value={courseName}
                onChange={(e) =>
                  setCourseName(e.target.value)
                }
              />

              <input
                placeholder="Price"
                value={coursePrice}
                onChange={(e) =>
                  setCoursePrice(e.target.value)
                }
              />

              <input
                placeholder="Duration"
                value={courseDuration}
                onChange={(e) =>
                  setCourseDuration(e.target.value)
                }
              />

              <button type="submit">
                Add Course
              </button>

            </form>

            <h3>My Courses</h3>

            {courses.length === 0 ? (
              <p>No courses added yet.</p>
            ) : (
              courses.map((course) => (

                <div
                  key={course.id}
                  className="course-card"
                >

                  <h3>{course.name}</h3>

                  <p>
                    Price: {course.price} SAR
                  </p>

                  <p>
                    Duration: {course.duration}
                  </p>

                  <p>
                    Students Joined:
                    {course.students}
                  </p>

                </div>

              ))
            )}

          </div>
        )}

      </div>
    )}

  </div>
)
}

export default Dashboard;