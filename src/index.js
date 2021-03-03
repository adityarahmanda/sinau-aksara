import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {Route, BrowserRouter as Router, Switch, Link} from "react-router-dom";
import Home from "./pages/Home";
import Play from "./pages/Play";
import AksaraConverter from "./pages/AksaraConverter";
import data from "./data.json";
import "./index.css";

class Quiz {
  constructor() {
    this.level = 0;
  }
}

class User {
  constructor(name, quizess) {
    this.name = name;
    this.wordsCollected = 0;
    this.maxStreak = 0;
    this.quiz = new Array(data.quiz.length);

    for(let i = 0; i < this.quiz.length; i++) {
      this.quiz[i] = new Quiz();
    }
  }
}

const App = () => {
  const quizzes = data.quiz;
  const [user, setUser] = useState(new User("Bambang"));

  const [selectedQuiz, setSelectedQuiz] = useState(0);
  const quiz = quizzes[selectedQuiz];
  
  const [selectedLevel, setSelectedLevel] = useState(0);
  const words = quiz.level[selectedLevel]; 

  const selectQuiz = (id, level) => {
    setSelectedQuiz(id);
    setSelectedLevel(level);
  }

  //Save user
  const saveProgress = () => {
    localStorage.setItem("user", JSON.stringify(user));
  }

  //Delete user
  const resetProgress = () => {
    localStorage.removeItem("user");
    setUser(new User(user.name));
  }

  //Load user
  useEffect(function() {
    let userLoadData = JSON.parse(localStorage.getItem("user"));
    if (userLoadData !== null) setUser(userLoadData);
  }, []);
  
  return(
    <Router>
      <div id="header">
            <div id="logo"><Link to="/">Sinau <br></br>Aksara</Link></div>
            <nav>
                <ul>
                    <li><a href="/pepak-bahasa-jawa">Pepak Bahasa Jawa</a></li>
                    <li><Link to="/konversi-aksara">Konverter Aksara</Link></li>
                </ul>
            </nav>
      </div>
      <div className="content-wrapper">
          <Switch>
            <Route path="/play" render={() => <Play quizzes={quizzes} words={words} user={user} selectedQuiz={selectedQuiz} saveProgress={saveProgress}/>}/>
            <Route path="/konversi-aksara" render={() => <AksaraConverter />}/>
            <Route path="/" render={() => <Home user={user} quizzes={quizzes} selectQuiz={selectQuiz} resetProgress={resetProgress} />}/>
          </Switch>
      </div>
    
    </Router>
  );
}

ReactDOM.render( <App />, document.getElementById("root"));
