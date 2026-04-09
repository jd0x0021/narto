import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import FormattedInputValue from '@/components/FormattedInputValue';
import { useSearchInputFocusHotkeys } from '@/hooks/useSearchInputFocusHotkeys';
import { useSearchStore } from '@/store/useSearchStore';
import { debounce } from '@/utils/debounce';
import { isValidCommand } from '@/utils/parseCommand';

export default function SearchInput() {
	const rawInput = useSearchStore((s) => s.rawInput);
	const setInput = useSearchStore((s) => s.setInput);
	const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
	const results = useSearchStore((s) => s.results);

	const inputRef = useRef<HTMLInputElement>(null);
	const presentationLayerRef = useRef<HTMLDivElement>(null);

	useSearchInputFocusHotkeys(inputRef);

	const hasValidCommand: boolean = isValidCommand(rawInput);

	const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
		if (presentationLayerRef.current) {
			presentationLayerRef.current.scrollLeft = e.currentTarget.scrollLeft;
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
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (results.length > 0) {
				setSelectedIndex(results.length - 1);
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

	return (
		<div className='shrink-0'>
			<div
				className='relative flex items-center bg-narto-input rounded-narto border border-white/10 px-4 py-[0.375rem]
				transition-all duration-200 focus-within:border-narto-accent focus-within:ring-1 focus-within:ring-narto-accent overflow-hidden'
			>
				<div className='w-full relative flex items-center text-base py-[0.313rem] mr-4'>
					{/* Presentation Layer: This is what the user actually sees. It sits under the invisible
						input field and handles all the visual styling, like the command chip and text formatting. */}
					<div
						ref={presentationLayerRef}
						className='absolute inset-0 flex items-center pointer-events-none whitespace-pre overflow-hidden text-narto-text'
						aria-hidden='true'
					>
						<FormattedInputValue rawInput={rawInput} />
					</div>

					{/* Interaction Layer: This is where the user actually types. It's a completely transparent input
						field that sits directly on top of the presentation layer to catch all keystrokes, creating the
						illusion that they are typing into the styled text (that is rendered by the presentation layer). */}
					<input
						ref={inputRef}
						type='text'
						value={rawInput}
						onChange={handleChange}
						onKeyDown={handleKeyDown}
						onScroll={handleScroll}
						onFocus={() => {
							setSelectedIndex(null);
						}}
						className={`w-full bg-transparent outline-none p-0 m-0 border-none text-transparent caret-white z-10 selection:bg-narto-accent/40 selection:text-transparent ${
							// The command chip element (from a valid command) uses a 'px-1' class (handled by the FormattedInputValue
							// component). We add 'pl-2' here to account for that padding and the space character, ensuring that
							// this input element's caret aligns perfectly with the UI elements rendered from the presentation layer.
							hasValidCommand ? 'pl-2' : ''
						}`}
						autoComplete='off'
						spellCheck='false'
					/>
				</div>

				<div className='w-[0.063rem] h-5 bg-white/10'></div>

				<div className='pl-4 ml-auto text-xs text-narto-muted font-bold tracking-wider whitespace-nowrap opacity-60 flex items-center shrink-0'>
					POWERED BY{' '}
					<span className='text-narto-accent ml-2 flex items-center gap-1'>⚡ CHCKN</span>
				</div>
			</div>

			<div className='mt-2.5 text-[0.75rem] text-narto-muted/60 pl-1'>
				Example: <span className='text-narto-muted/40'>/meme cat, /gif oiia</span>
			</div>
		</div>
	);
}
