import { Component } from 'react';
import PropTypes from 'react';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharactersList extends Component {
	state = {
		charactersList: [],
		loading: true,
		error: false,
		newItemsLoading: false,
		offset: 210,
		charactersEnded: false,
	};

	marvelService = new MarvelService();

	componentDidMount() {
		this.onRequest();
	}

	onRequest = (offset) => {
		this.onCharListLoading();
		this.marvelService
			.getAllCharacters(offset)
			.then(this.onCharactersListLoaded)
			.catch(this.onError);
	};

	onCharListLoading = () => {
		this.setState({
			newItemsLoading: true,
		});
	};

	onCharactersListLoaded = (newCharactersList) => {
		let ended = false;

		if (newCharactersList.length < 9) {
			ended = true;
		}

		this.setState(({ offset, charactersList }) => ({
			charactersList: [...charactersList, ...newCharactersList],
			loading: false,
			newItemsLoading: false,
			offset: offset + 9,
			charactersEnded: ended,
		}));
	};

	onError = () => {
		this.setState({ error: true, loading: false });
	};

	itemsRefs = [];

	setRef = (ref) => {
		this.itemsRefs.push(ref);
	};

	focusOnItem = (id) => {
		this.itemsRefs.forEach((item) => item.classList.remove('char__item_selected'));
		this.itemsRefs[id].classList.add('char__item_selected');
		this.itemsRefs[id].focus();
	};

	renderItems(arr) {
		const items = arr.map((item, i) => {
			let imgStyle = { objectFit: 'cover' };
			if (
				item.thumbnail ===
				'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
			) {
				imgStyle = { objectFit: 'unset' };
			}

			return (
				<li
					className="char__item"
					tabIndex={0}
					ref={this.setRef}
					key={item.id}
					onClick={() => {
						this.props.onCharacterSelected(item.id);
						this.focusOnItem(i);
					}}
				>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className="char__name">{item.name}</div>
				</li>
			);
		});

		return <ul className="char__grid">{items}</ul>;
	}

	render() {
		const { charactersList, loading, error, newItemsLoading, offset, charactersEnded } =
			this.state;

		const items = this.renderItems(charactersList);

		const errorMessage = error ? <ErrorMessage /> : null;
		const spinner = loading ? <Spinner /> : null;
		const content = !(loading || error) ? items : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				{content}
				<button
					className="button button__main button__long"
					disabled={newItemsLoading}
					style={{ display: charactersEnded ? 'none' : 'block' }}
					onClick={() => this.onRequest(offset)}
				>
					<div className="inner">load more</div>
				</button>
			</div>
		);
	}
}

export default CharactersList;
