import React from "react";
import { useHistory } from "react-router-dom";
import { RiEdit2Fill, RiShieldFill } from "react-icons/ri";
import { countProgressLevelWords, countWords } from "../helper.js";

const Home = ({user, quizzes, resetProgress, selectQuiz}) => {
    const history = useHistory();

    const themeCard = (quiz, i) => {
        const currentLevel = user.quiz[i].level;
        const progressLevelWords = countProgressLevelWords(quiz, currentLevel);
        const totalWords = countWords(quiz);
        const progressPercentage = (progressLevelWords / totalWords) * 100;

        const play = () => {
            if(currentLevel < user.quiz.length) {
                selectQuiz(i, currentLevel);
                history.push('/play');
            }
        }

        return(<div className="theme-card" onClick={() => play()}>
            <div className="theme-header">
                <div className="theme-description">
                <h3>{quiz.theme}</h3>
                <span className="word-count">{progressLevelWords}/{totalWords} kata</span>
                </div>
                <div className="level"><RiShieldFill className="shield" /><span>{(currentLevel + 1)}</span></div>
            </div>
            <div className="progress">
                <div className="loading-bar">
                    <div className="loading-fill" style={{width: progressPercentage + "%"}}/>
                </div>
                <div className="icon"><div className="in-progress" /></div>
            </div>
        </div>);
    }

    return(
      <>
            <div className="userdata">
                <h2>Hai, <span className="username">{user.name}<RiEdit2Fill/></span></h2>
                <div className="stats">
                    <p>Uji kemampuan aksara jawamu dengan menyelesaikan setiap kata dalam aksara jawa pada tiap-tiap tema permainan berikut</p>
                    <div className="data">
                        <div className="number">{user.wordsCollected}</div>
                        <div className="desc">kata diselesaikan</div>
                    </div>
                    <div className="data">
                        <div className="number">{user.maxStreak}</div>
                        <div className="desc">streak tertinggi didapatkan</div>
                    </div>
                    <button className="reset-btn" onClick={resetProgress}>Atur Ulang Permainan</button>
                </div>
            </div>
            <main>
                <div className="themes">
                    <div className="message-card">
                        Masih awam dengan aksara jawa?
                        <a href="/pepak-bahasa-jawa/aksara-jawa">Pelajari di sini</a>
                    </div>
                    <div>
                        <h1>Tema</h1>
                        <div class="theme-card-wrapper">
                            {quizzes.map((quiz, i) => themeCard(quiz, i))}
                        </div>
                    </div>
                </div>
            </main>
      </>
    );
}

export default Home;