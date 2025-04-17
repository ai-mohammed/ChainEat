// Import global styles
import "../App.css";

// Import team member images
import leo from "../assets/leo.jpeg";
import luna from "../assets/Luna_.jpg";
import mohammed from "../assets/mohammed.jpg";
import olzhas from "../assets/olzhas.jpeg";

// Import GitHub icon from react-icons
import { FaGithub } from "react-icons/fa";

// List of team members with their personal info and GitHub links
const teamMembers = [
  {
    name: "Léo Gaudin",
    role: "leo.gaudin@student.griffith.ie",
    image: leo,
    bio: "21-year-old French student studying Computer Science. Passionate about technology and digital innovation.",
    github: "https://github.com/Loloeny",
  },
  {
    name: "Luna Grandjean",
    role: "luna.grandjean@student.griffith.ie",
    image: luna,
    bio: "20-year-old French Computer Science student. Loves designing user-friendly interfaces and building creative apps.",
    github: "https://github.com/LunaGrandjean",
  },
  {
    name: "Mohammed Addi",
    role: "mohammed.addi@student.griffith.ie",
    image: mohammed,
    bio: "22-year-old Algerian student passionate about full-stack web development and problem-solving.",
    github: "https://github.com/ai-mohammed",
  },
  {
    name: "Olzhas Samat",
    role: "olzhas.samat@student.griffith.ie",
    image: olzhas,
    bio: "Kazakhstani Computer Science student with a strong interest in development and cloud technologies.",
    github: "https://github.com/osama0211",
  },
];

// Main component to display the About Us section
const AboutUs = () => {
  return (
    // Wrapper for the entire section
    <div className="about-us-wrapper">

      {/* Introductory text about the team and project */}
      <div className="about-team-intro-box">
        <h3 className="about-heading">
          About Our Team
          <span className="about-underline" />
        </h3>
        <p className="about-paragraph">
          We are a team of third-year Computer Science students at <strong>Griffith College</strong>. This project was
          developed as part of our <strong>Web Technology</strong> module, where we were asked to design a full-stack web
          application from scratch.
        </p>
        <p className="about-paragraph">
          <strong style={{ color: "#ff6600" }}>ChainEats</strong> was created with a shared goal in mind: to simplify
          restaurant reservations in a fast, intuitive, and modern way. The project reflects our collaboration,
          creativity, and technical growth throughout this academic year.
        </p>
      </div>

      {/* Display of team members in a card grid layout */}
      <div className="team-grid">
        {teamMembers.map((member, idx) => (
          <div key={idx} className="team-member">
            {/* Profile photo */}
            <img src={member.image} alt={member.name} className="team-photo" />

            {/* Name and email */}
            <h3 className="team-name">{member.name}</h3>
            <p className="team-role">{member.role}</p>

            {/* Short biography */}
            <p className="bio-text">{member.bio}</p>

            {/* GitHub profile link with icon */}
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              aria-label={`GitHub profile of ${member.name}`}            
            >
              <FaGithub style={{ marginRight: "6px" }} />
              GitHub
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

// Exporting the component to be used in routing
export default AboutUs;
