export enum MachineStates {
  setup = "setup",
  playing = "playing",
  win = "win",
}

export enum MachineActions {
  start = "start",
  finish = "finish",
  reset = "reset",
}

export type MachineState = keyof typeof MachineStates;
export type MachineAction = keyof typeof MachineActions;

export type StateMachine = {
  [state in MachineStates]: {
    [action in MachineActions]?: MachineState;
  };
};

export const stateMachine: StateMachine = {
  [MachineStates.setup]: {
    [MachineActions.start]: MachineStates.playing,
  },
  [MachineStates.playing]: {
    [MachineActions.finish]: MachineStates.win,
    [MachineActions.reset]: MachineStates.setup,
  },
  [MachineStates.win]: {
    [MachineActions.reset]: MachineStates.setup,
  },
};

export const getNextState = (state: MachineState, action: MachineAction) => {
  const newState = stateMachine[state][action];

  if (!newState) {
    throw new Error(`${action} is not a valid step from ${state}`);
  }

  console.log(`setting state ${newState}`);
  return newState;
};
