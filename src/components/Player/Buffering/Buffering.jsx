import { useEffect, useState } from "react";

function Buffering(props) {
    const [bufferingWidth, setBufferingWidth] = useState(10)

    useEffect(()=>{},[])
    
    return <div className="player__buffering" style={{width: `${bufferingWidth}%`}}></div>;
}

export default Buffering;