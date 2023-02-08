import play from "../../../img/play.svg"
function Controls(props) {
    return <img src={play} onClick={props.play} alt='play' />;
}

export default Controls;