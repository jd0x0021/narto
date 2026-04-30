import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useRef } from 'react';

import CommandMenu from '@/components/CommandMenu';
import FormattedInputValue from '@/components/FormattedInputValue';
import { useSearchInputFocusHotkeys } from '@/hooks/useSearchInputFocusHotkeys';
import type { AppCommandType } from '@/services/providers/searchProvider.types';
import { useAppStore } from '@/store/useAppStore';
import { debounce } from '@/utils/debounce';
import type { ParsedSearchInput } from '@/utils/parseSearchInput';
import { isValidCommand, parseSearchInput } from '@/utils/parseSearchInput';

export default function SearchInput() {
	const rawInput = useAppStore((s) => s.rawInput);
	const query: string = useAppStore((s) => s.query);
	const resolvedCommand: AppCommandType = useAppStore((s) => s.resolvedCommand);
	const setInput = useAppStore((s) => s.setInput);
	const setSelectedGridIndex = useAppStore((s) => s.setSelectedGridIndex);
	const handleSearchInputKeyDown = useAppStore((s) => s.handleSearchInputKeyDown);

	const inputRef = useRef<HTMLInputElement>(null);
	const presentationLayerRef = useRef<HTMLDivElement>(null);

	const showCommandMenu: boolean = rawInput === '/';
	const hasValidCommand: boolean = isValidCommand(rawInput);

	useSearchInputFocusHotkeys(inputRef);

	const handleScroll = (e: React.UIEvent<HTMLInputElement>) => {
		if (presentationLayerRef.current) {
			presentationLayerRef.current.scrollLeft = e.currentTarget.scrollLeft;
		}
	};

	// Focus effect
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	/**
	 * Schedules the search function to run after 200ms is elapsed since the last
	 * invocation. If the user types again before the 200ms is up, the timer resets.
	 */
	const debouncedSearch = useMemo(
		() =>
			debounce(() => {
				void useAppStore.getState().runSearch();
			}, 200),
		[],
	);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const rawUserInput = e.target.value;
		setInput(rawUserInput);
		const parsed: ParsedSearchInput = parseSearchInput(rawUserInput);

		// Don't fetch if command menu is shown or if query is empty
		if (rawUserInput === '/' || parsed.query.length < 1) {
			debouncedSearch.cancel();

			const { requestId } = useAppStore.getState();
			useAppStore.setState({
				// Increment the global requestId to invalidate any in-flight search requests.
				// This is crucial for canceling searches that may have already started executing.
				// When runSearch's captured nextId no longer matches the updated requestId in the store, the
				// stale fetch result will be rejected, preventing old data from overwriting cleared results.
				requestId: requestId + 1,
				results: [],
				status: 'idle',
				selectedGridIndex: null,
			});
		} else {
			debouncedSearch();
		}
	};

	useEffect(() => {
		return useAppStore.subscribe((state, prevState) => {
			// Return focus to input if selectedIndex goes to null from grid
			if (prevState.selectedGridIndex !== null && state.selectedGridIndex === null) {
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
				<div className='w-full relative flex items-center text-base py-[0.313rem]'>
					{/* Presentation Layer: This is what the user actually sees. It sits under the invisible
						input field and handles all the visual styling, like the command chip and text formatting. */}
					<div
						ref={presentationLayerRef}
						className='absolute inset-0 flex items-center pointer-events-none overflow-hidden text-narto-text'
						aria-hidden='true'
					>
						{hasValidCommand ? (
							<FormattedInputValue
								command={resolvedCommand}
								text={query.length === 0 ? ` Search ${resolvedCommand}s...` : ` ${query}`}
								isTextMuted={query.length === 0}
							/>
						) : !rawInput ? (
							// show placeholder text
							<span className='text-narto-muted/50'>Search KLIPY</span>
						) : (
							<span>{rawInput}</span>
						)}
					</div>

					{/* Interaction Layer: This is where the user actually types. It's a completely transparent input
						field that sits directly on top of the presentation layer to catch all keystrokes, creating the
						illusion that they are typing into the styled text (that is rendered by the presentation layer). */}
					<input
						ref={inputRef}
						type='text'
						value={rawInput}
						onChange={handleChange}
						onKeyDown={handleSearchInputKeyDown}
						onScroll={handleScroll}
						onFocus={() => {
							setSelectedGridIndex(null);
						}}
						className={`w-full bg-transparent outline-none p-0 m-0 border-none text-transparent caret-white z-10 selection:bg-narto-accent/40 selection:text-transparent ${
							// The command chip element (from a valid command) uses a 'px-1' class (handled by the FormattedInputValue
							// component). We add 'pl-2' here to account for that padding and the space character, ensuring that
							// this input element's caret aligns perfectly with the UI elements rendered from the presentation layer.
							hasValidCommand ? 'pl-2' : ''
						}`}
						autoComplete='off'
						spellCheck='false'
						maxLength={67}
					/>
				</div>
			</div>

			{showCommandMenu ? (
				<div className='mt-2'>
					<CommandMenu />
				</div>
			) : null}
		</div>
	);
}
