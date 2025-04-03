import "../App.css";
import leo from "../assets/leo.jpeg";
import luna from "../assets/luna3.jpeg";
import mohammed from "../assets/mohammed.jpg";
import olzhas from "../assets/olzhas.jpeg";

const teamMembers = [
  { name: "Léo Gaudin", role: "✉: leo.gaudin@student.griffith.ie", image: leo },
  { name: "Luna Grandjean", role: "✉: luna.grandjean@student.griffith.ie", image: luna },
  { name: "Mohammed Addi", role: "✉: mohammed.addi@student.griffith.ie", image: mohammed },
  { name: "Olzhas Samat", role: "✉: olzhas.samat@student.griffith.ie", image: olzhas },
];

const AboutUs = () => {
  return (
    <div className="team-container">
      <h2 className="section-title">Meet Our Team</h2>
      <div className="team-grid-flip">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="team-card-flip">
            <div className="card-inner">
              <div className="card-front">
                <img src={member.image} alt={member.name} />
                <h3>{member.name}</h3>
              </div>
              <div className="card-back">
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
