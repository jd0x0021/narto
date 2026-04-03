import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import { useSearchStore } from '../store/useSearchStore';
import { debounce } from '../utils/debounce';

export default function SearchInput() {
	const rawInput = useSearchStore((s) => s.rawInput);
	const resolvedCommand = useSearchStore((s) => s.resolvedCommand);
	const setInput = useSearchStore((s) => s.setInput);
	const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
	const results = useSearchStore((s) => s.results);

	const inputRef = useRef<HTMLInputElement>(null);

	// Focus effect
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const debouncedSearch = useMemo(
		() =>
			debounce(() => {
				void useSearchStore.getState().runSearch();
			}, 200),
		[],
	);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
		const { query } = useSearchStore.getState();

		if (query.length >= 1) {
			debouncedSearch();
		} else {
			debouncedSearch.cancel();
			useSearchStore.setState({
				results: [],
				status: 'idle',
				selectedIndex: null,
			});
		}
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Escape') {
			e.preventDefault();
			window.close();
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (results.length > 0) {
				setSelectedIndex(0);
				inputRef.current?.blur(); // drop focus from input
			}
		} else if (e.key === 'Enter') {
			e.preventDefault();
			// Enter never fetches
		}
	};

	useEffect(() => {
		return useSearchStore.subscribe((state, prevState) => {
			// Return focus to input if selectedIndex goes to null from grid
			if (prevState.selectedIndex !== null && state.selectedIndex === null) {
				inputRef.current?.focus();
			}
		});
	}, []);

	const hasValidCommand =
		rawInput.trimStart().startsWith('/meme ') || rawInput.trimStart().startsWith('/gif ');
	const displayCommand = hasValidCommand ? rawInput.trimStart().split(' ')[0] : '';
	const displayQuery = hasValidCommand
		? rawInput.trimStart().substring(displayCommand.length).trimStart()
		: rawInput;

	return (
		<div className='shrink-0'>
			<div
				className={`relative flex items-center bg-narto-input-bg rounded-narto border px-4 py-3 
        ${rawInput ? 'border-narto-accent shadow-[0_0_15px_rgba(255,107,0,0.1)]' : 'border-narto-border/60 hover:border-narto-border opacity-90'}`}
			>
				<div className='w-full flex items-center text-base'>
					{hasValidCommand && (
						<div className='bg-narto-accent text-white px-2 py-0.5 rounded font-bold mr-2 text-sm leading-tight shrink-0'>
							{displayCommand}
						</div>
					)}

					<input
						ref={inputRef}
						type='text'
						value={rawInput}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						className={`w-full bg-transparent outline-none placeholder-narto-muted/50 ${hasValidCommand ? 'text-transparent absolute inset-0 pl-[theme(spacing.24)] opacity-0 cursor-text z-10' : 'text-narto-text z-10 relative'}`}
						style={hasValidCommand ? { paddingLeft: '80px' } : {}}
						autoComplete='off'
						spellCheck='false'
					/>

					{hasValidCommand && (
						<div className='flex-1 whitespace-pre pointer-events-none text-narto-text'>
							{displayQuery || (
								<span className='text-narto-muted/50'>Search {resolvedCommand}s...</span>
							)}
						</div>
					)}

					{!hasValidCommand && !rawInput && (
						<div className='absolute inset-0 px-4 py-3 pointer-events-none text-narto-muted/50'>
							Search memes, reactions, gifs...
						</div>
					)}
				</div>

				<div className='pl-4 ml-auto border-l border-narto-border text-xs text-narto-muted font-bold tracking-wider whitespace-nowrap opacity-60 flex items-center shrink-0'>
					POWERED BY{' '}
					<span className='text-narto-accent ml-2 flex items-center gap-1'>⚡ CHCKN</span>
				</div>
			</div>
			<div className='mt-4 text-sm text-narto-muted/50 font-medium px-1'>
				Example: /meme cat, /gif oiia
			</div>
		</div>
	);
}
