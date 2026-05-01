import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import type { AppStateCreator } from '@/store/appStore.types';
import type { CommandMenuSlice } from '@/store/slices/commandMenuSlice/commandMenuSlice.types';

const commandOptions: readonly AppCommandType[] = Object.values(AppCommand);

export const createCommandMenuSlice: AppStateCreator<CommandMenuSlice> = (set, get) =>
	({
		selectedCommandIndex: 0,

		setSelectedCommandIndex: (index: number) => {
			set({ selectedCommandIndex: index });
		},

		chooseCommand: (index: number) => {
			const command: AppCommandType = commandOptions[index];
			get().setInput(`/${command} `);
			set({ selectedCommandIndex: 0 });
		},
	}) satisfies CommandMenuSlice;
