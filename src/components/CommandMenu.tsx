import CommandChip from '@/components/CommandChip';
import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { AppCommand } from '@/services/providers/searchProvider.types';

const commandDescriptions = {
	meme: 'get static meme images',
	gif: 'get animated memes',
} as const satisfies Record<AppCommandType, string>;

const validCommands: readonly AppCommandType[] = Object.values(AppCommand);

export default function CommandMenu() {
	return (
		<div className='w-full rounded-narto border border-white/10 bg-narto-panel text-sm font-sans'>
			{validCommands.map((command, index) => (
				<div
					key={command}
					className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors duration-150 hover:bg-white/5 ${
						index < validCommands.length - 1 ? 'border-b border-white/10' : ''
					}`}
				>
					<span className='text-base leading-6 flex items-baseline whitespace-pre'>
						<CommandChip command={command} />
						<span className='text-narto-muted/50'> + your search input:</span>
					</span>
					<span className='text-base leading-6 text-narto-text'>
						{commandDescriptions[command]}
					</span>
				</div>
			))}
		</div>
	);
}
