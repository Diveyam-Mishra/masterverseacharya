import React from 'react';
import './Religion.css';

export default function Religion() {
  return (
    <div className="center-wrapper">
      <div className="content-column">
        <div id="Box1"> 
          <div id="medi">
            <img src="/medi.png" alt="Meditation" />
            Meditation
          </div>
          <div id="budh">
            <img src="/budh.png" alt="Buddhism" />
            Buddhism
          </div>
          <div id="tao">
            <img src="/tao.png" alt="Taoism" />
            Taoism
          </div>
          <div id="hindu">
            <img src="/hindu.png" alt="Hinduism" />
            Hinduism
          </div>
          <div id="chris">
            <img src="/chris.png" alt="Christianity" />
            Christianity
          </div>
          <div id="islam">
            <img src="/islam.png" alt="Islam" />
            Islam
          </div>
        </div>
        <button type="button" id="Begin">Begin Your Journey</button>
      </div>
    </div>
  );
}
