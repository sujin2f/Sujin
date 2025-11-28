/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import type { ReactElement } from 'react';

type Attributes = {
	images: {
		id: number;
		src: string;
	}[];
};

type Props = {
	attributes: Attributes;
	setAttributes: ( attributes: Partial< Attributes > ) => void;
};

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {ReactElement} Element to render.
 */
export default function Edit( { attributes, setAttributes }: Props ): ReactElement {
	const { className, ...blockProps } = useBlockProps();

	return (
		<div { ...blockProps } className={ `${ className } components-placeholder` }>
			<div style={ { display: 'flex' } }>
				{ attributes.images.map( ( image ) => (
					<img src={ image.src } width="100" height="100" />
				) ) }
			</div>
			<MediaUploadCheck>
				<MediaUpload
					onSelect={ ( media ) => {
						setAttributes( {
							images: media.map( ( image ) => ( {
								id: image.id,
								src: image.url,
								width: image.sizes.full.width,
								height: image.sizes.full.height,
							} ) ),
						} );
					} }
					multiple={ true }
					value={ Object.values( attributes.images ).map( ( image ) => image.id ) }
					gallery={ true }
					render={ ( { open } ) => (
						<Button variant="primary" onClick={ open }>
							Edit Gallery
						</Button>
					) }
				/>
			</MediaUploadCheck>
		</div>
	);
}
