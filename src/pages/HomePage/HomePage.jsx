import TimeInput from "../../components/TimeInput/TimeInput";
import TimeOutput from "../../components/TimeOutput/TimeOutput";
import "./HomePage.css";

const HomePage = () => {
  return (
    <section className="home-section">
      <h1>Time Tracker</h1>
      <article className="home-section-content">
        <TimeInput />
        <TimeOutput />
      </article>
    </section>
  );
};

export default HomePage;
