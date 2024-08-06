import React from "react";

interface ShurikenProps {
  className?: string; // Add className as an optional prop
}

const Shuriken: React.FC<ShurikenProps> = ({ className }) => (
  <svg
    fill="currentColor"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="800px"
    height="800px"
    viewBox="0 0 388.625 388.625"
    xmlSpace="preserve"
    className={`shuriken-svg ${className}`}
  >
    <g>
      <g>
        <g id="Layer_5_35_">
          <g>
            <path
              d="M195.913,387.42l36.854-94.414c0.625-1.601,0.104-3.864-1.159-5.03l-22.966-21.205
                c-1.264-1.164-2.293-3.523-2.293-5.242l-0.002-11.201c0-1.125,0.445-1.31,0.666-1.358c20.902-4.691,37.402-21.14,42.187-42.006
                c0.047-0.203,0.106-0.618,0.698-0.617h12.492c1.718,0,4.076,1.032,5.242,2.297l20.348,22.032
                c1.166,1.264,3.431,1.784,5.031,1.159l94.412-36.851c1.603-0.625,1.604-1.646,0-2.271l-94.414-36.852
                c-1.601-0.625-3.863-0.104-5.029,1.16l-20.348,22.035c-1.168,1.262-3.524,2.294-5.244,2.294l-12.789,0.001
                c-0.586,0-0.688-0.521-0.756-0.779c-5.139-19.952-21.049-35.623-41.146-40.4c-0.446-0.106-1.351-0.354-1.351-1.233
                l-0.002-12.698c0.002-1.719,1.033-4.077,2.297-5.244l22.035-20.348c1.262-1.166,1.783-3.429,1.158-5.03L194.983,1.204
                c-0.624-1.602-1.646-1.602-2.271,0l-36.852,94.414c-0.624,1.602-0.103,3.864,1.159,5.029l22.036,20.349
                c1.262,1.166,2.295,3.525,2.295,5.243v12.894c0,1.271-0.677,1.338-1.013,1.428c-19.316,5.176-34.528,20.477-39.583,39.844
                c-0.082,0.313-0.165,0.949-0.851,0.949h-13.663c-1.72-0.001-4.079-1.032-5.245-2.295l-20.351-22.035
                c-1.167-1.265-3.431-1.786-5.031-1.16l-94.414,36.85c-1.602,0.626-1.602,1.646,0,2.272l94.416,36.852
                c1.601,0.625,3.863,0.104,5.028-1.158l20.349-22.032c1.166-1.266,3.524-2.298,5.244-2.298h13.37
                c0.641,0,0.743,0.593,0.812,0.886c4.708,20.087,20.281,36.027,40.162,41.26c0.256,0.066,0.769,0.213,0.769,1.497v13.255
                c0,1.72-1.033,4.079-2.296,5.245l-21.105,19.49c-1.262,1.166-1.784,3.43-1.159,5.029l23.425,60.02
                c0.626,1.602,1.136,2.998,1.136,3.104c0.002,0.105,0.036,0.191,0.077,0.191c0.041-0.001,0.585,1.312,1.21,2.911l11.002,28.188
                C194.267,389.023,195.288,389.023,195.913,387.42z M165.217,194.491c0.001-16.301,13.262-29.563,29.561-29.563
                c16.302,0,29.562,13.263,29.562,29.562s-13.262,29.562-29.562,29.562C178.478,224.051,165.217,210.79,165.217,194.491z"
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default Shuriken;