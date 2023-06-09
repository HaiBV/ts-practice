import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "src/setup/store";
import initPlayers from "src/data/players";

export interface Player {
  id: number;
  name: string;
  score: number;
}

export interface ScoreboardState {
  players: Player[];
}

const initialState: ScoreboardState = {
  players: initPlayers,
};

export const scoreboardSlice = createSlice({
  name: "scoreboard",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPlayer: (state, action: PayloadAction<Player>) => {
      state.players.push(action.payload);
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    updatePlayerScore: (state, action: PayloadAction<Pick<Player, "id" | "score">>) => {
      const { id, score } = action.payload;
      state.players = state.players.map((player) => (player.id === id ? { ...player, score } : player));
    },
  },
});

export const { addPlayer, updatePlayerScore } = scoreboardSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectScoreboard = (state: RootState) => state.scoreboard;

export default scoreboardSlice.reducer;
