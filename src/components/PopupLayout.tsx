import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { useAppStore } from '@/store/useAppStore';

type PopupLayoutProps = {
	children: ReactNode;
};

export default function PopupLayout({ children }: PopupLayoutProps) {
	const isGridPreviewReady = useAppStore((s) => s.isGridPreviewReady);

	return (
		<div className='w-[555px] max-h-[600px] bg-narto-main text-narto-text flex flex-col font-sans relative box-border'>
			<Header />
			<main
				className={`flex-1 overflow-hidden flex flex-col relative px-6 pt-6 border-y border-white/10
					${
						// This is to avoid layout shift when preview images are loading (this allows
						// the ImageGallery to flow through the footer, and not get visually cut off)
						isGridPreviewReady ? '' : 'pb-6'
					}`}
			>
				{children}
			</main>
			<Footer />
		</div>
	);
}
