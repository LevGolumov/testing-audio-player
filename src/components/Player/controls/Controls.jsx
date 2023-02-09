import play from "../../../img/play.svg"
import pause from "../../../img/pause.svg"
function Controls(props) {
    return <img src={props.isPlaying ? pause : play} onClick={props.play} alt='play' />;
}

export default Controls;