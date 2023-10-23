import React, { useState, useEffect } from "react";
import * as htmlToImage from 'html-to-image';
import Draggable from 'react-draggable'
import '../App.css';

export default function Middle() {
  const [meme, setMeme] = useState({
    topText: "",
    bottomText: "",
    memeImgUrl: "https://i.imgflip.com/30b1gx.jpg"
  });

  const [textColor, setTextColor] = useState('#ffff')
  const [allMemes, setAllMemes] = useState([]);

  useEffect(() => {
    async function getMemes() {
      try {
        const res = await fetch("https://api.imgflip.com/get_memes");
        const data = await res.json();
        setAllMemes(data.data.memes);
      } catch (error) {
        console.error("Error fetching memes:", error);
      }
    }
    getMemes();
  }, []);

  function getImageUrl() {
    const randomNum = Math.floor(Math.random() * allMemes.length);
    const url = allMemes[randomNum].url;
    setMeme((prevMeme) => ({
      ...prevMeme,
      memeImgUrl: url
    }));
  }

  function handleChange(event) {
    setMeme((prevMeme) => ({
      ...prevMeme,
      [event.target.name]: event.target.value
    }));
  }

  const [imageData, setImageData] = useState(null);

  function downloadImage() {
    const memeImage = document.querySelector(".meme");

    htmlToImage.toPng(memeImage)
      .then((dataUrl) => {
        setImageData(dataUrl);
        // Create an anchor element with a download attribute and trigger a click
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "meme.png";
        link.click();
      })
      .catch((error) => {
        console.error("Error capturing image:", error);
      });
  }

  
  return (
    <section className="middle">
      <div className="forms">
        <input
          className="input-box"
          type="text"
          placeholder="Top-Text"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
        />
        <input
          className="input-box"
          type="text"
          placeholder="Bottom-Text"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />

        <input
          className="input-box"
          type="COLOR"
          value={textColor}
          onChange={(e)=> (setTextColor(e.target.value))}
        />

        <button className="meme-btn" onClick={getImageUrl}>
          Generate New image
        </button>
        <button className="meme-btn" onClick={downloadImage}>
        Download Meme
        </button>
      </div>
      <div className="meme">
        <img src={meme.memeImgUrl} alt="meme-picture" className="meme-img" />
        <Draggable
            defaultPosition={{x:0, y:0}}
        >
            <h2 className="meme-text top"
                style={{color:textColor}}
            >{meme.topText}</h2>
        </Draggable>
        <Draggable
            defaultPosition={{x:0, y:0}}
        >
            <h2 className="meme-text bottom"
                style={{color:textColor}}
            >{meme.bottomText}</h2>
        </Draggable>
        
      </div>
    </section>
  );
}
