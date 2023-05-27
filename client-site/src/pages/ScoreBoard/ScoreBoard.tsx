import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./scoreboard.css";

const ScoreBoard: React.FC = () => {
  const [playerScore, setPlayerScore] = useState(0);

  return (
    <Container className="scoreboard">
      <Row>My Scoreboard</Row>
      <Row>
				<Col>Player name</Col>
				<Col><button onClick={() => setPlayerScore(playerScore + 1)}>+</button></Col>
				<Col>{playerScore}</Col>
				<Col><button onClick={() => setPlayerScore(playerScore - 1)}>-</button></Col>
			</Row>
    </Container>
  );
};

export default ScoreBoard;
