import { useRef, useState, useContext } from "react";
import Controls from "./controls/Controls";
import Slider from "./slider/Slider";
import playerThumb from "../../img/playerSliderThumb.svg";
import volumeThumb from "../../img/volumeSliderThumb.svg";
import { LinkContext } from "../context/link-context";

function Player(props) {
  const linkCtx = useContext(LinkContext);
  const link = linkCtx.link;

  // Shortening the link in the title if needed
  let titleLink = link;
  if (titleLink.length > 44) {
    titleLink = titleLink.slice(0, 44) + "...";
  }
  // Getting user prefered volume saved in the local storage
  let savedVolume = localStorage.getItem("volume");
  // If there's no info in the local storage, setting up a default value
  if (!savedVolume) {
    savedVolume = 70;
  }
  const [trackPercentage, setTrackPercentage] = useState(0);
  const [volume, setVolume] = useState(savedVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const audioRef = useRef();

  // Handling the audio thumb position
  function sliderChangeHandler(event) {
    const audio = audioRef.current;
    audio.currentTime = (audio.duration / 100) * event.target.value;
    setTrackPercentage(event.target.value);
  }

  // Handling volume changes and saving the result to the local storage
  function volumeChangeHandler(event) {
    audioRef.current.volume = event.target.value / 100;
    localStorage.setItem("volume", event.target.value);
    setVolume(event.target.value);
  }

  // Playing or pausing the track
  function playHandler() {
    const audio = audioRef.current;
    audio.volume = volume / 100;

    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
    }

    if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
    }
  }

  // Setting up the current time
  const getCurrTime = (event) => {
    const percent = (
      (event.currentTarget.currentTime / event.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = event.currentTarget.currentTime;

    // Moving the audio thumb
    setTrackPercentage(+percent);
    setCurrentTime(time.toFixed(2));
  };

  // Returning the timer info
  function secondsToHms(seconds) {
    if (!seconds) return "00:00";

    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % 3600;

    let min = parseInt(duration / 60);
    duration = duration % 60;

    let sec = parseInt(duration);

    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }

    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}:${min}:${sec}`;
    } else if (min === 0) {
      return `00:${sec}`;
    } else {
      return `${min}:${sec}`;
    }
  }

  // Showing buffering animation
  function bufferingHandler() {
    setIsBuffering(true);
  }

  // Handling buffering animation based on playability
  function canPlayHandler() {
    const audio = audioRef.current;
    setIsBuffering(false);
    // Showing the animation if the audio not fully ready
    if (audio.readyState >= 0 && audio.readyState < 4) {
      setIsBuffering(true);
    } else {
    // Hiding the animation
      setIsBuffering(false);
    }
  }

  // Resetting states at the end of the track
  function endingHandler(){
    setIsPlaying(false);
    setIsBuffering(false);
  }

  return (
    <div className="container">
      <p className="player__link">{titleLink}</p>
      <div className="player">
        <div
          className={
            isBuffering ? "player__buffering" : "player__not-buffering"
          }
        ></div>
        <Controls play={playHandler} isPlaying={isPlaying} />
        <Slider
          name="audio"
          thumb={playerThumb}
          percentage={trackPercentage}
          className="player__progress-bar"
          onChange={sliderChangeHandler}
        />
        <audio
          preload="auto"
          ref={audioRef}
          onTimeUpdate={getCurrTime}
          onLoadStart={bufferingHandler}
          onWaiting={bufferingHandler}
          onCanPlayThrough={canPlayHandler}
          onEnded={endingHandler}
        >
          <source src={link} />
        </audio>
        <div className="player__info-row">
          <div className="player__timer">{secondsToHms(currentTime)}</div>
          <Slider
            name="volume"
            thumb={volumeThumb}
            className="player__volume"
            percentage={volume}
            onChange={volumeChangeHandler}
          />
        </div>
      </div>
      <p className="player__back" onClick={() => props.setPage("input")}>
        ← Back
      </p>
    </div>
  );
}

export default Player;
