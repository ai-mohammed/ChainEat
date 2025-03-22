import "../App.css"; // or create AboutUs.css if you want it separate
import userImage from "../assets/user.png";

const teamMembers = [
  { name: "Mohammed Addi", role: "role1", image: userImage },
  { name: "Léo Gaudin", role: "role2", image: userImage },
  { name: "Luna Grandjean", role: "role3", image: userImage },
  { name: "Olzhas Samat", role: "role4", image: userImage },
];

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1 className="about-title">
        Meet the <span className="highlight">ChainEats</span> Team
      </h1>
      <p className="about-description">
        We are a team of passionate developers who built ChainEats to make
        restaurant booking easier.
      </p>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <img src={member.image} alt={member.name} className="team-photo" />
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
