    import React from 'react';
    import aboutImage from '../../assets/about.jpg';
    import '../../css/AboutSection.css';

    const AboutSection = () => {
    return (
        <div className="About">
        <div className="about-sub">
            <div className="aboimg">
            <img src={aboutImage} alt="about" />
            </div>
            <div className="paragraph">
            <h3>About Us</h3>
            <h2>Welcome to Resto</h2>
            <p> 
                    your go-to destination for delicious food, warm hospitality <br />
                    and memorable moments with family and friends.
            </p>
            <button className="learnmorebtn">
                <a href="/Aboutus">Learn More</a>
            </button>
            </div>
        </div>
        <div className="bookingbanner">
            <h3>NOW BOOKINGS</h3>
            <p>
                Whether you're planning weeks in advance or making last-minute family plans, <br />
                we've got you covered. At Resto
                we make it simple to reserve your table—24/7, through text or online booking.
            </p>
        </div>
        </div>
    );
    };

    export default AboutSection;
