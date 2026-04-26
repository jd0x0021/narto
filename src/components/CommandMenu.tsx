import CommandChip from '@/components/CommandChip';
import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';

const commandDescriptions = {
	meme: 'get static meme images',
	gif: 'get animated memes',
} as const satisfies Record<AppCommandType, string>;

const validCommands: readonly AppCommandType[] = Object.values(AppCommand);

export default function CommandMenu() {
	const selectedCommandIndex = useAppStore((s) => s.selectedCommandIndex);
	const setSelectedCommandIndex = useAppStore((s) => s.setSelectedCommandIndex);
	const chooseCommand = useAppStore((s) => s.chooseCommand);
	const handleCommandMenuKeyDown = useAppStore((s) => s.handleCommandMenuKeyDown);

	return (
		<div
			className='w-full rounded-narto border border-white/10 bg-narto-panel text-sm font-sans overflow-hidden'
			role='listbox'
		>
			{validCommands.map((command, index) => {
				const isSelected = selectedCommandIndex === index;
				return (
					<div
						key={command}
						id={`command-menu-item-${command}`}
						role='option'
						aria-selected={selectedCommandIndex === index}
						tabIndex={0}
						onClick={() => {
							chooseCommand(command);
						}}
						onMouseDown={(e) => {
							e.preventDefault();
						}}
						onMouseEnter={() => {
							setSelectedCommandIndex(index);
						}}
						onKeyDown={(e) => {
							handleCommandMenuKeyDown(e, index);
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
