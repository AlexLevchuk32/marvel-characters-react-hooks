import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

const CharactersList = (props) => {
	const [charactersList, setCharactersList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [newItemsLoading, setNewItemsLoading] = useState(false);
	const [offset, setOffset] = useState(210);
	const [charactersEnded, setCharactersEnded] = useState(false);

	const marvelService = new MarvelService();

	// useEffect запустится только после рендера, поэтому стрелочну функцию
	// onRequest можно вызвать выше объявления самой функции.
	// Оставляем пустой массив зависимостей, чтобы функция выполнилась только один раз,
	// при создании компонента, иначе можно получить бесконечный цикл.
	useEffect(() => {
		onRequest();
	}, []);

	const onRequest = (offset) => {
		onCharListLoading();
		marvelService.getAllCharacters(offset).then(onCharactersListLoaded).catch(onError);
	};

	const onCharListLoading = () => {
		setNewItemsLoading(true);
	};

	const onCharactersListLoaded = (newCharactersList) => {
		let ended = false;

		if (newCharactersList.length < 9) {
			ended = true;
		}

		setCharactersList((charactersList) => [...charactersList, ...newCharactersList]);
		setLoading((loading) => false);
		setNewItemsLoading((newItemsLoading) => false);
		setOffset((offset) => offset + 9);
		setCharactersEnded((charactersEnded) => ended);
	};

	const onError = () => {
		setError(true);
		setLoading((loading) => false);
	};

	// useRef используется только на верхнем уровне компонента.
	// В useRef нельзя помещать условия, внутренние функции, циклы - это запрещено.
	const itemsRefs = useRef([]);

	const focusOnItem = (id) => {
		itemsRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
		itemsRefs.current[id].classList.add('char__item_selected');
		itemsRefs.current[id].focus();
	};

	function renderItems(arr) {
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
					ref={(el) => (itemsRefs.current[i] = el)}
					key={item.id}
					onClick={() => {
						props.onCharacterSelected(item.id);
						focusOnItem(i);
					}}
				>
					<img src={item.thumbnail} alt={item.name} style={imgStyle} />
					<div className="char__name">{item.name}</div>
				</li>
			);
		});

		return <ul className="char__grid">{items}</ul>;
	}

	const items = renderItems(charactersList);

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
				onClick={() => onRequest(offset)}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	);
};

CharactersList.propTypes = {
	onCharSelected: PropTypes.func.isRequired,
};

export default CharactersList;
