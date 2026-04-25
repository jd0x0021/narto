import CommandChip from '@/components/CommandChip';
import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';

const commandDescriptions = {
	meme: 'get static meme images',
	gif: 'get animated memes',
} as const satisfies Record<AppCommandType, string>;

const validCommands: readonly AppCommandType[] = Object.values(AppCommand);

type CommandMenuProps = {
	selectedIndex: number | null;
	onSelectIndex: (index: number) => void;
	onChooseCommand: (command: AppCommandType) => void;
};

export default function CommandMenu({
	selectedIndex,
	onSelectIndex,
	onChooseCommand,
}: CommandMenuProps) {
	return (
		<div
			className='w-full rounded-narto border border-white/10 bg-narto-panel text-sm font-sans overflow-hidden'
			role='listbox'
		>
			{validCommands.map((command, index) => {
				const isSelected = selectedIndex === index;
				return (
					<div
						key={command}
						id={`command-menu-item-${command}`}
						role='option'
						aria-selected={selectedIndex === index}
						tabIndex={0}
						onClick={() => {
							onChooseCommand(command);
						}}
						onMouseDown={(e) => {
							e.preventDefault();
						}}
						onMouseEnter={() => {
							onSelectIndex(index);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onChooseCommand(command);
								return;
							}

							if (e.key === 'ArrowDown') {
								e.preventDefault();
								onSelectIndex((index + 1) % validCommands.length);
								return;
							}

							if (e.key === 'ArrowUp') {
								e.preventDefault();
								onSelectIndex((index - 1 + validCommands.length) % validCommands.length);
								return;
							}
						}}
						className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150 ${
							isSelected ? 'bg-white/5' : 'hover:bg-white/5'
						} ${index < validCommands.length - 1 ? 'border-b border-white/10' : ''}`}
					>
						<span className='text-base leading-6 flex items-baseline whitespace-pre'>
							<CommandChip command={command} />
							<span className='text-narto-muted/50'> + your search input:</span>
						</span>
						<span className='text-base leading-6 text-narto-text'>
							{commandDescriptions[command]}
						</span>
					</div>
				);
			})}
		</div>
	);
}
