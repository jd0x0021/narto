import type { ReactNode } from 'react';

type FormattedInputValueProps = {
	prefixElement: ReactNode;
	text: string;
	isTextMuted?: boolean;
};

/**
 * Renders the formatted version of the user's search input. This component
 * is responsible to display a visually enhanced version of the user's search input.
 *
 * @param prefixElement - The element to display before the main text.
 * @param text - The text displayed after the prefix element.
 * @param isTextMuted - Optional flag to mute the text styling.
 * @returns A JSX Fragment containing the formatted input UI elements.
 */
export function FormattedInputValue({
	prefixElement,
	text,
	isTextMuted = false,
}: FormattedInputValueProps) {
	return (
		<span className='text-base leading-6 flex items-center whitespace-pre'>
			{prefixElement}
			<span className={isTextMuted ? 'text-narto-muted/50' : 'text-narto-text'}>{text}</span>
		</span>
	);
}
