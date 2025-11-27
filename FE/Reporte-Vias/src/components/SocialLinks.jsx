import React from "react";
import "../styles/SocialLinks.css";

const SocialLinks = () => {
  return (
    <div className="social-container">

      {/* LINKEDIN */}
      <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
        <span className="icon linkedin">
          <svg preserveAspectRatio="xMidYMid" viewBox="0 0 256 256">
            <path 
              d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
              fill="#ffffff"
            />
          </svg>
        </span>
      </a>

      {/* FACEBOOK — CORREGIDO (rectangular, mismo estilo que los demás) */}
      <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
        <span className="icon facebook">
          <svg viewBox="0 0 320 512" fill="#ffffff">
            <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 
            12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 
            225.36 0c-73.22 0-121.07 44.38-121.07
            124.72v70.62H22.89V288h81.4v224h100.2V288z"/>
          </svg>
        </span>
      </a>

      {/* INSTAGRAM */}
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <span className="icon instagram">
          <svg 
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <circle cx="12" cy="12" r="4"></circle>
            <circle cx="17" cy="7" r="1.5"></circle>
          </svg>
        </span>
      </a>

      {/* TWITTER X */}
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <span className="icon twitter">
          <svg fill="none" viewBox="0 0 1200 1227">
            <path
              fill="#fff"
              d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
            />
          </svg>
        </span>
      </a>

    </div>
  );
};

export default SocialLinks;
