import type { ReactNode } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

type PopupLayoutProps = {
	children: ReactNode;
};

export default function PopupLayout({ children }: PopupLayoutProps) {
	return (
		<div className='w-[555px] max-h-[600px] bg-narto-bg text-narto-text flex flex-col font-sans relative box-border'>
			<Header />
			<main className='flex-1 overflow-hidden flex flex-col relative p-6'>{children}</main>
			<Footer />
		</div>
	);
}
