import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import { useSearchStore } from '@/store/useSearchStore';
import { debounce } from '@/utils/debounce';

export default function SearchInput() {
	const rawInput = useSearchStore((s) => s.rawInput);
	const resolvedCommand = useSearchStore((s) => s.resolvedCommand);
	const setInput = useSearchStore((s) => s.setInput);
	const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
	const results = useSearchStore((s) => s.results);

	const inputRef = useRef<HTMLInputElement>(null);
	const fakeLayerRef = useRef<HTMLDivElement>(null);

	const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
		if (fakeLayerRef.current) {
			fakeLayerRef.current.scrollLeft = e.currentTarget.scrollLeft;
		}
	};

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

	let formattedContent;
	if (hasValidCommand) {
		const commandIndex = rawInput.indexOf(displayCommand);
		const beforeCommand = rawInput.substring(0, commandIndex);
		const commandText = displayCommand;
		const afterCommand = rawInput.substring(commandIndex + commandText.length);
		const showPlaceholder = displayQuery.length === 0;

		formattedContent = (
			<>
				<span>{beforeCommand}</span>
				<span className='text-narto-accent'>{commandText}</span>
				{showPlaceholder ? (
					<>
						<span>{afterCommand}</span>
						<span className='text-narto-muted/50'>Search {resolvedCommand}s...</span>
					</>
				) : (
					<span>{afterCommand}</span>
				)}
			</>
		);
	} else {
		formattedContent = (
			<>
				<span>{rawInput}</span>
				{!rawInput && (
					<span className='text-narto-muted/50'>Search memes, reactions, gifs...</span>
				)}
			</>
		);
	}

	return (
		<div className='shrink-0'>
			<div
				className='relative flex items-center bg-narto-input rounded-narto border border-white/10 px-4 py-3
				transition-all duration-200 focus-within:border-narto-accent focus-within:ring-1 focus-within:ring-narto-accent overflow-hidden'
			>
				<div className='w-full relative flex items-center text-base pr-4'>
					<div
						ref={fakeLayerRef}
						className='absolute inset-0 flex items-center pointer-events-none whitespace-pre overflow-hidden text-narto-text'
						aria-hidden='true'
					>
						{formattedContent}
					</div>

					<input
						ref={inputRef}
						type='text'
						value={rawInput}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						onScroll={handleScroll}
						className='w-full bg-transparent outline-none p-0 m-0 border-none text-transparent caret-white z-10 selection:bg-narto-accent/40 selection:text-transparent'
						autoComplete='off'
						spellCheck='false'
					/>
				</div>

				<div className='w-[1px] h-5 bg-white/10'></div>

				<div className='pl-4 ml-auto text-xs text-narto-muted font-bold tracking-wider whitespace-nowrap opacity-60 flex items-center shrink-0'>
					POWERED BY{' '}
					<span className='text-narto-accent ml-2 flex items-center gap-1'>⚡ CHCKN</span>
				</div>
			</div>

			<div className='mt-2.5 text-[12px] text-narto-muted/60 pl-1'>
				Example: <span className='text-narto-muted/40'>/meme cat, /gif oiia</span>
			</div>
		</div>
	);
}
