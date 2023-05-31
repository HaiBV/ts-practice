import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { updatePlayerScore, selectScoreboard } from "./scoreboardSlice";
import "./scoreboard.css";

interface Player {
  id: number;
  name: string;
  score: number;
}

const ScoreBoard: React.FC = () => {
  const { players } = useAppSelector(selectScoreboard);
  const dispatch = useAppDispatch();

  return (
    <Container>
      <section className="scoreboard">
        <Container fluid>
          <Row className="header">
            <Col md={3}>
              <table>
                <tbody>
                  <tr>
                    <td className="title">Players:</td>
                    <td className="value">{players.length}</td>
                  </tr>
                  <tr>
                    <td className="title">Total Score:</td>
                    <td className="value">{players.reduce((acc: number, player: Player): number => acc + player.score, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={5}>My Scoreboard</Col>
          </Row>
          <div className="players">
            {players.map((player) => (
              <Row key={player.id}>
                <Col md={8}>{player.name}</Col>
                <Col md={4} className="player-score">
                  <Button
                    onClick={() => dispatch(updatePlayerScore({ id: player.id, score: player.score - 1 }))}
                    className="counter-action decrement btn-success btn btn-default"
                  >
                    -
                  </Button>
                  {player.score}
                  <Button
                    onClick={() => dispatch(updatePlayerScore({ id: player.id, score: player.score + 1 }))}
                    className="counter-action increment btn-danger btn btn-default"
                  >
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
