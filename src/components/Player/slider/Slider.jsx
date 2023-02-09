import { Fragment, useState, useRef, useEffect } from "react";
function Slider(props) {
  const rangeRef = useRef();
  const thumRef = useRef(null)

  const [position, setPosition] = useState(0);
  const [marginLeft, setMarginLeft] = useState(-16);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

  // Here we have a range type input underneath the styled track
  // User gets the illusion of dragging the styled thumb, but in fact they drag the input thumb underneath it
  // The default input is hidden with the opasity: 0, check out the player__input class
  useEffect(() => {
        const rangeWidth = rangeRef.current.getBoundingClientRect().width;
        const thumbWidth = thumRef.current.getBoundingClientRect().width;
        // Handling the styled thumb centration over the default one
        const centerThumb = (thumbWidth / 100) * props.percentage * -1;
        // Handling the progress bar edge
        const centerProgressBar =
          thumbWidth +
          (rangeWidth / 100) * props.percentage -
          (thumbWidth / 100) * props.percentage;
    
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
