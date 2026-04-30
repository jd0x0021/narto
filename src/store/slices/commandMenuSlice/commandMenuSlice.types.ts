export type CommandMenuSlice = {
	selectedCommandIndex: number;
	setSelectedCommandIndex: (index: number) => void;
	chooseCommand: (index: number) => void;
};
