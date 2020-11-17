import React from "react";
import calculateWinner from "utils/calculateWinner";
import Board from "components/Board";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo, faRedo, faSync } from "@fortawesome/free-solid-svg-icons";
export default class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			stepNumber: 0,
			xIsNext: true,
		};
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? "X" : "O";
		this.setState({
			history: history.concat([
				{
					squares: squares,
				},
			]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
	}

	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: step % 2 === 0,
		});
	}

	resetGame() {
		this.setState({
			history: [
				{
					squares: Array(9).fill(null),
				},
			],
			xIsNext: true,
			stepNumber: 0,
		});
	}

	render() {
		const history = this.state.history;
		const stepNumber = this.state.stepNumber;
		const current = history[stepNumber];
		const winner = calculateWinner(current.squares);

		const undoButton = (
			<button
				onClick={() => this.jumpTo(stepNumber - 1 > 0 ? stepNumber - 1 : 0)}
			>
				<FontAwesomeIcon icon={faUndo} />
			</button>
		);

		const redoButton = (
			<button
				onClick={() =>
					this.jumpTo(
						stepNumber + 1 < history.length - 1
							? stepNumber + 1
							: history.length - 1
					)
				}
			>
				<FontAwesomeIcon icon={faRedo} />
			</button>
		);

		const restartButton = (
			<button onClick={() => this.resetGame()}>
				<FontAwesomeIcon icon={faSync} />
			</button>
		);

		let status;
		if (winner) {
			status = `Winner: ${winner}`;
		} else {
			status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
		}

		return (
			<div className="game">
				<div className="game-title">
					<h1>Tic-Tac-Toe</h1>
				</div>
				<div className="game-board">
					<Board
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<div>{restartButton}</div>
					<div>
						{undoButton}
						{redoButton}
					</div>
				</div>
			</div>
		);
	}
}
