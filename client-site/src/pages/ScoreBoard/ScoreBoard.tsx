import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import "./scoreboard.css";
import initPlayers from "../../data/players";

interface Player {
	id: number;
  name: string;
  score: number;
}

const ScoreBoard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(initPlayers);
  const [playerScore, setPlayerScore] = useState(0);

  return (
    <Container>
      <section className="scoreboard">
        <Container fluid>
          <Row className="header">My Scoreboard</Row>
          <div className="players">
            {players.map((player) => (
              <Row key={player.id}>
                <Col md={8}>{player.name}</Col>
                <Col md={4} className="player-score">
                  <Button onClick={() => setPlayerScore(playerScore - 1)} className="counter-action decrement btn-success btn btn-default">
                    -
                  </Button>
                  {player.score}
                  <Button onClick={() => setPlayerScore(playerScore + 1)} className="counter-action increment btn-danger btn btn-default">
                    +
                  </Button>
                </Col>
              </Row>
            ))}
          </div>
        </Container>
      </section>
    </Container>
  );
};

export default ScoreBoard;
