import PopupLayout from './components/PopupLayout';
import SearchInput from './components/SearchInput';
import ImageGallery from './components/ImageGallery';

export default function App() {
	return (
		<PopupLayout>
			<SearchInput />
			<ImageGallery />
		</PopupLayout>
	);
}
