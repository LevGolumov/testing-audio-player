import { useRef, useState } from "react";
import video from "../../Rick.mp4";
import Controls from "./controls/Controls";

function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef();

  function play() {
    const audio = audioRef.current;
    audio.volume = 0.1;

    if (!isPlaying) {
      setIsPlaying(true);
      audio.play();
    }

    if (isPlaying) {
      setIsPlaying(false);
      audio.pause();
    }
  }

  return (
    <div className="player">
      <Controls play={play} />
      <audio ref={audioRef}>
        <source src={video} />
      </audio>
    </div>
  );
}

export default Player;
