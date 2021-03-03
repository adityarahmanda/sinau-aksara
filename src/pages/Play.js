import React, {useState, useEffect, useRef} from "react"
import {useSpring, animated} from "react-spring"
import {RiCloseFill, RiSettings3Fill, RiFireFill} from "react-icons/ri"
import {Link, useHistory} from "react-router-dom";
import Choices from "../components/Choices"
import {generateChoices, aksarafy, syllabify, countProgressWords} from "../helper"

const Play = ({quizzes, words, user, selectedQuiz, saveProgress}) => {
    const history = useHistory();

    const [number, setNumber] = useState(0);
    const [currentAksara, setCurrentAksara] = useState(0);
    const updateAksara = useRef(true);

    const syllables = syllabify(words[number].toLowerCase());

    const [choices, setChoices] = useState(Array(4).fill(""));
    const allowChoosing = useRef(true);

    const [streak, setStreak] = useState(false);
    const [streakCount, setStreakCount] = useState(0);
    const [notification, setNotifications] = useState("");
    const notificationStyle = useSpring({opacity: 1, from: {opacity: 0}});
    const progressFill = useSpring({width: ((number/words.length) * 100) + '%'});
    
    const checkAnswer = (answer) => {
      if (!allowChoosing.current) return;
      
      if(answer === syllables[currentAksara]) {
        if(currentAksara >= (syllables.length - 1)) {
          if(number >= (words.length - 1)) {
            user.quiz[selectedQuiz].level++;
            user.wordsCollected = countProgressWords(quizzes, user);
            saveProgress();
            history.push('/');
          } else {
            if(!streak) setStreak(true);
            let newStreak = streakCount + 1;

            if(newStreak > user.maxStreak) {
              user.maxStreak = newStreak;
              saveProgress();
            }

            setStreakCount(newStreak);
            showNotification(<><RiFireFill className="icons"/>streak {newStreak}</>);
            
            allowChoosing.current = false;
            setCurrentAksara(currentAksara + 1);

            setTimeout(function() {  
              allowChoosing.current = true;
              setNumber(number + 1);
              setCurrentAksara(0);
              updateAksara.current = true;
            }, 2000);
          }
        } else {
          setCurrentAksara(currentAksara + 1);
          updateAksara.current = true;
        }
      } else {
        if(streak) {
          setStreak(false);
          showNotification("lose streak");
        }
        if(streakCount > 0) setStreakCount(0);
      }
    }

    const showNotification = (message) => {
      setNotifications(message);
    }

    useEffect(() => {
      if(updateAksara.current) {
        setChoices(generateChoices(syllables[currentAksara]));
        updateAksara.current = false;
      }
    }, [currentAksara, syllables]);

    return(
        <div className="quiz-wrapper">
            <Link to="/"><RiCloseFill class="close-btn"/></Link>
            <RiSettings3Fill class="settings-btn"/>

            <div className="progress-wrapper">
                <div className="progress-bar"><animated.div className="progress-fill" style={progressFill}/></div>
            </div>
            <div className="quiz">
                <div className="instruction">Choose the correct character</div>
                <div className="question-wrapper">
                {syllables.map((syllable, i) => 
                    <div className="question-pieces">
                    <div className={`aksara${(i === currentAksara ? " current" : "") + (currentAksara > i ? " answered" : "")}`}>{aksarafy(syllable)}</div>
                    <div className={`latin`}><div className={`content${(i === currentAksara ? " current" : "")}`}>{currentAksara > i && syllable}</div></div>
                    </div>)}
                </div>
                <div className="choices-wrapper">
                    <Choices choices={choices} onClick={choice => checkAnswer(choice)}/>
                </div>
            </div>
            <div className="notification">
                {notification !== "" && <animated.div style={notificationStyle}>{notification}</animated.div>}
            </div>
        </div>
    );
}

export default Play;