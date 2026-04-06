import { useSearchStore } from '@/store/useSearchStore';
import { isValidCommand } from '@/utils/parseCommand';

type FormattedInputValueProps = {
	rawInput: string;
};

export default function FormattedInputValue({ rawInput }: FormattedInputValueProps) {
	const hasValidCommand: boolean = isValidCommand(rawInput);
	const query: string = useSearchStore((s) => s.query);
	const resolvedCommand: string = useSearchStore((s) => s.resolvedCommand);

	if (hasValidCommand) {
		const showPlaceholder: boolean = query.length === 0;

		return (
			<>
				<span className='bg-narto-accent text-white rounded-md px-1 pb-[1.5px]'>
					{`/${resolvedCommand}`}
				</span>
				{showPlaceholder ? (
					<span className='text-narto-muted/50'> Search {resolvedCommand}s...</span>
				) : (
					<span>{` ${query}`}</span>
				)}
			</>
		);
	}

	return (
		<>
			<span>{rawInput}</span>
			{!rawInput ? (
				<span className='text-narto-muted/50'>Search memes, reactions, gifs...</span>
			) : null}
		</>
	);
}
