import FormattedInputValue from '@/components/FormattedInputValue';
import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';

const commandDescriptions = {
	meme: 'get static meme images',
	gif: 'get animated memes',
} as const satisfies Record<AppCommandType, string>;

const validCommands: readonly AppCommandType[] = Object.values(AppCommand);

/**
 * This component renders a dropdown list of valid commands ({@link validCommands}) when the user
 * types `/` in the global search input. It allows users to select a command, which will then be applied
 * as a value to  the search input. Different commands trigger different search behaviors, and this menu
 * serves as a guide to  inform users of their options (e.g. `/gif` command will get animated memes).
 */
export default function CommandMenu() {
	const selectedCommandIndex = useAppStore((s) => s.selectedCommandIndex);
	const chooseCommand = useAppStore((s) => s.chooseCommand);

	return (
		<div
			className='w-full rounded-narto border border-white/10 bg-narto-panel text-sm font-sans overflow-hidden'
			role='listbox'
		>
			{validCommands.map((command, index) => {
				const isSelected = selectedCommandIndex === index;
				return (
					<button
						key={command}
						id={`command-menu-item-${command}`}
						role='option'
						aria-selected={selectedCommandIndex === index}
						tabIndex={0}
						onClick={() => {
							chooseCommand(index);
						}}
						onMouseDown={(e) => {
							e.preventDefault();
						}}
						className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150 focus:outline-none w-full ${
							isSelected ? 'bg-white/10' : 'hover:bg-white/5'
						} ${index < validCommands.length - 1 ? 'border-b border-white/10' : ''}`}
					>
						<FormattedInputValue command={command} text=' + your search input:' isTextMuted />
						<span className='text-base leading-6 text-narto-text'>
							{commandDescriptions[command]}
						</span>
					</button>
				);
			})}
		</div>
	);
}
