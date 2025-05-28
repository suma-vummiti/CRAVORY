import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                 <img src={assets.recent1} alt="" />
                 <p>Cravory brings your favorite meals from top restaurants straight to your doorstep with speed and care. Whether it’s breakfast, lunch, or dinner — we make every bite count. Enjoy reliable service, real-time tracking, and delicious food every day.</p>
                 <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt=""/>
                    <img src={assets.twitter_icon} alt=""/>
                    <img src={assets.linkedin_icon} alt=""/>
                 </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                 <h2>GET IN TOUCH</h2>
                 <ul>
                    <li>+1-212-456-7890</li>
                    <li>contact@cravory.com</li>
                 </ul>
            </div>
        </div>
        <hr/>
        <p className="footer-copyright">Copyright 2024 @ cravory.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer
