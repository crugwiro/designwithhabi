// src/components/HeroSection.js
import './HeroSection.css';

function HeroSection() {
    return (
        <section className="hero-section">
            <video className="hero-video" autoPlay loop muted playsInline poster="/path/to/video-poster.jpg">
                {/* Provide multiple sources for browser compatibility */}
                <source src="/dance.MP4" type="video/mp4" />
                {/* <source src="/path/to/your-dance-video.webm" type="video/webm" /> */}
                Your browser does not support the video tag.
            </video>
            <div className="hero-overlay"></div> {/* For darkening the video a bit */}
            <div className="hero-content">
                {/* If you have an SVG or image logo for "Live, Love, Dance" */}
                {/* <img src="/path/to/live-love-dance-logo.svg" alt="Live, Love, Dance" className="hero-logo" /> */}
                <h1 className="hero-logo-text">Live. Love. Dance</h1>
                {/* Optional: Add a call to action button */}
                {/* <Link to="/schedule" className="button button-cta">View Classes</Link> */}
            </div>
        </section>
    );
}

export default HeroSection;