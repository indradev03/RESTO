    import React from 'react';
    import logo from '../../assets/RestoLogo.png';
    import '../../css/Footer.css';

    const Footer = () => {
    return (
        <>
        <footer className="footer">
            <div className="footer-Container">
            <div className="footer-row">
                <div className="footer-menu">
                <div className="Footer-item">
                    <img src={logo} alt="LOGO" />
                    <p>
                    Welcome to the resto here we can serve the best food in the world,
                    anything you can order from here.
                    </p>
                </div>
                </div>
                <div className="footer-menu">
                <div className="help">
                    <h3>Get Help</h3>
                    <ul>
                    <li><a href="/stepsforbooking">How to book a table?</a></li>
                    <li><a href="/Aboutus">About us</a></li>
                    <li><a href="/Contact">Contact us</a></li>
                    <li><a href="#">FAQ</a></li>
                    </ul>
                </div>
                </div>
                <div className="footer-menu">
                <div className="callus">
                    <h4>Call us</h4>
                    <p>
                    Our helpline stays the same across Kathmandu, Bhaktapur, Chitwan,<br />
                    and Butwal for seamless support.
                    </p>
                    <h4>Contact Details</h4>
                    <p>7864477, 6744177, 4578979,<br /> 9845441519</p>
                </div>
                </div>
                <div className="footer-menu">
                <div className="servicehr">
                    <h3>Service Hours</h3>
                    <ul>
                    <li><span>SUN</span><span>10am - 6:30pm</span></li>
                    <li><span>MON</span><span>10am - 6:30pm</span></li>
                    <li><span>TUE</span><span>10am - 6:30pm</span></li>
                    <li><span>WED</span><span>10am - 6:30pm</span></li>
                    <li><span>THU</span><span>10am - 6:30pm</span></li>
                    <li><span>FRI</span><span>10am - 6:30pm</span></li>
                    <li><span>SAT</span><span>Holiday</span></li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </footer>
        <div className="copyrights">
            <h4>&copy; 2025 Resto. All rights reserved. Saroj Ayer</h4>
        </div>
        </>
    );
    };

    export default Footer;
