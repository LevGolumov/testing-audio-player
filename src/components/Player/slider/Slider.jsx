import { Fragment, useState, useRef, useEffect } from "react";
function Slider(props) {
  const rangeRef = useRef();
  const thumRef = useRef(null)

  const [position, setPosition] = useState(0);
  const [marginLeft, setMarginLeft] = useState(-16);
  const [progressBarWidth, setProgressBarWidth] = useState(0);


  useEffect(() => {
        const rangeWidth = rangeRef.current.getBoundingClientRect().width;
        const thumbWidth = thumRef.current.getBoundingClientRect().width;
        const centerThumb = (thumbWidth / 100) * props.percentage * -1;
        const centerProgressBar =
          thumbWidth +
          (rangeWidth / 100) * props.percentage -
          (thumbWidth / 100) * props.percentage;
    
        // console.log(props.name + ":" + centerThumb, "thumbWidth:", thumbWidth);
        setPosition(props.percentage);
        setMarginLeft(centerThumb);
        setProgressBarWidth(centerProgressBar);
    
  }, [props.percentage, props.thumbWidth, thumRef]);


  return (
    <Fragment>
      <div className={props.className}>
        <div
          className={`${props.className}--cover`}
          style={{
            width: `${progressBarWidth}px`,
          }}
        ></div>
        <img
          className="player__thumb"
          src={props.thumb}
          ref={thumRef}
          alt="input thumb"
          style={{
            left: `${position}%`,
            marginLeft: `${marginLeft}px`
          }}
        />
        <input
          type="range"
          value={position}
          ref={rangeRef}
          className="player__input"
          onChange={props.onChange}
        ></input>
      </div>
    </Fragment>
  );
}

export default Slider;
