import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';
import './charInfo.scss';

const CharInfo = (props) => {
	const [character, setCharacter] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const marvelService = new MarvelService();

	useEffect(() => {
		updateCharacter();
	}, [props.characterId]);

	const updateCharacter = () => {
		const { characterId } = props;
		if (!characterId) {
			return;
		}

		onCharacterLoading();

		marvelService.getOneCharacter(characterId).then(onCharacterLoaded).catch(onError);
	};

	const onCharacterLoaded = (character) => {
		setLoading(false);
		setCharacter(character);
	};

	const onCharacterLoading = () => {
		setLoading(true);
	};

	const onError = () => {
		setError(true);
		setLoading(false);
	};

	const skeleton = character || loading || error ? null : <Skeleton />;
	const errorMessage = error ? <ErrorMessage /> : null;
	const spinner = loading ? <Spinner /> : null;
	const content = !(loading || error || !character) ? (
		<View character={character} />
	) : null;

	return (
		<div className="char__info">
			{skeleton}
			{errorMessage}
			{spinner}
			{content}
		</div>
	);
};

const View = ({ character }) => {
	const { name, description, thumbnail, homepage, wiki, comics } = character;

	let imgStyle = { objectFit: 'cover' };
	if (
		thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
	) {
		imgStyle = { objectFit: 'contain' };
	}

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} style={imgStyle} />
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				{comics.length > 0 ? null : 'There is no comics with this character'}
				{comics.map((item, i) => {
					// eslint-disable-next-line
					if (i > 9) return;
					return (
						<li key={i} className="char__comics-item">
							{item.name}
						</li>
					);
				})}
			</ul>
		</>
	);
};

CharInfo.propTypes = {
	characterId: PropTypes.number,
};

export default CharInfo;
