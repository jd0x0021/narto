import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import type { AppStateCreator } from '@/store/appStore.types';
import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';

const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

/**
 * This slice encapsulates the state and behavior of the command menu (the
 * dropdown of valid commands {@link AppCommandType}). It manages the
 * currently highlighted command during keyboard navigation and the
 * logic for selecting and applying a command to the search input.
 *
 * @param set - The Zustand setter function for updating state.
 * @param get - The Zustand getter function for reading current state.
 * @returns The initial state and actions for the command menu.
 */
export const createCommandMenuSlice: AppStateCreator<CommandMenuSlice> = (set, get) =>
	({
		selectedCommandIndex: 0,

		chooseCommand: (index: number) => {
			const command: AppCommandType = commandOptions[index];
			get().setInput(`/${command} `);
			set({ selectedCommandIndex: 0 });
		},
	}) satisfies CommandMenuSlice;
