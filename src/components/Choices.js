import React from "react";

const Choices = ({choices, onClick}) => {
    return(
        <>
        {choices.map((choice, i) => <button key={i} className="choices" onClick={() => onClick(choice)}>{choice}</button>)}
        </>
    );
}

export default Choices;