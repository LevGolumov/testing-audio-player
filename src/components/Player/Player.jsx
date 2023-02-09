import { useRef, useState, useContext } from "react";
import video from "../../Rick.mp4";
import Controls from "./controls/Controls";
import Slider from "./slider/Slider";
import playerThumb from "../../img/playerSliderThumb.svg";
import volumeThumb from "../../img/volumeSliderThumb.svg";
import Buffering from "./Buffering/Buffering";
import { LinkContext } from "../context/link-context";

function Player(props) {
  const linkCtx = useContext(LinkContext);
  const link = linkCtx.link;
  let titleLink = link
  if (titleLink.length > 49 ) {
    titleLink = titleLink.slice(0, 49) + "..."
  }
  let savedVolume = localStorage.getItem("volume");
  if (!savedVolume) {
    savedVolume = 70;
  }
  const [trackPercentage, setTrackPercentage] = useState(0);
  const [volume, setVolume] = useState(savedVolume);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef();

  function sliderChangeHandler(event) {
    const audio = audioRef.current;
    audio.currentTime = (audio.duration / 100) * event.target.value;
    setTrackPercentage(event.target.value);
  }

  function volumeChangeHandler(event) {
    audioRef.current.volume = event.target.value / 100;
    localStorage.setItem("volume", event.target.value);
    setVolume(event.target.value);
  }

  function play() {
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

  const getCurrDuration = (event) => {
    const percent = (
      (event.currentTarget.currentTime / event.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = event.currentTarget.currentTime;

    setTrackPercentage(+percent);
    setCurrentTime(time.toFixed(2));
  };

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

  return (
    <div className="container">
      <p className="player__link">{titleLink}</p>
      <div className="player">
        <Buffering />
        <Controls play={play} isPlaying={isPlaying} />
        <Slider
          name="audio"
          thumb={playerThumb}
          percentage={trackPercentage}
          className="player__progress-bar"
          onChange={sliderChangeHandler}
        />
        <audio ref={audioRef} onTimeUpdate={getCurrDuration}>
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
      <p className="player__back" onClick={() => props.setPage("input")}>← Back</p>
    </div>
  );
}

export default Player;
