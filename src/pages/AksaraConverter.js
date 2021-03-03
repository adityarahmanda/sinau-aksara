import React, { useState } from "react";
import { aksarafy, toMurda } from "../helper"

const AksaraConverter = () => {
    const [input, setInput] = useState("");
    const aksara = aksarafy(input);
    
    const [isMurda, setIsMurda] = useState(false);
    const result = isMurda ? toMurda(aksara) : aksara;

    return(
        <div className="converter">
            <div className="input">
                <h3>Latin</h3>
                <form>
                    <textarea className="input box" type="text" name="latin" onChange={e => setInput(e.target.value)}></textarea>
                    <label class="switch">
                        <input type="checkbox" onChange={e => setIsMurda(e.target.checked)}></input>
                        <span class="slider"></span></label>Murda
                </form>
            </div>
            <div className="output">
                <h3>Aksara</h3>
                <div className="result box">{result}</div>
            </div>
        </div>
    );
}

export default AksaraConverter;