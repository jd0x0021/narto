import ImageGallery from './components/ImageGallery';
import PopupLayout from './components/PopupLayout';
import SearchInput from './components/SearchInput';

export default function App() {
	return (
		<PopupLayout>
			<SearchInput />
			<ImageGallery />
		</PopupLayout>
	);
}
