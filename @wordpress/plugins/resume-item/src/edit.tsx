/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, RichText, URLInputButton } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl, Button, CheckboxControl } from '@wordpress/components';
import React, { useCallback } from 'react';
import type { Attributes } from './types';

type Props = {
	attributes: Attributes;
	setAttributes: ( attributes: Partial< Attributes > ) => void;
};

const MONTHS = [
	{ label: 'Select...', value: '' },
	{ label: 'January', value: '01' },
	{ label: 'February', value: '02' },
	{ label: 'March', value: '03' },
	{ label: 'April', value: '04' },
	{ label: 'May', value: '05' },
	{ label: 'June', value: '06' },
	{ label: 'July', value: '07' },
	{ label: 'August', value: '08' },
	{ label: 'September', value: '09' },
	{ label: 'October', value: '10' },
	{ label: 'November', value: '11' },
	{ label: 'December', value: '12' },
];

function generateYears( start = 1995, end = new Date().getFullYear() ): { label: string; value: string }[] {
	// TODO @common module
	const years = new Array( end - start ).fill( 0 ).map( ( _, index ) => ( {
		label: ( end - index ).toString(),
		value: ( end - index ).toString(),
	} ) );
	return [ { label: 'Select...', value: '' }, ...years ];
}

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
 * @return {React.ReactElement} Element to render.
 */
export default function Edit( { attributes, setAttributes }: Props ): React.ReactElement {
	const { className, ...blockProps } = useBlockProps();
	const years = generateYears();

	// TODO custom hook
	const addDetails = useCallback( () => {
		const next = [ ...( attributes.details || [] ), '' ];
		setAttributes( { details: next } );
	}, [ attributes, setAttributes ] );
	const updateDetails = useCallback(
		( index: number, value: string ) => {
			const next = [ ...( attributes.details || [] ) ];
			next[ index ] = value;
			setAttributes( { details: next } );
		},
		[ attributes, setAttributes ],
	);
	const removeDetails = useCallback(
		( index: number ) => {
			const next = [ ...( attributes.details || [] ) ];
			next.splice( index, 1 );
			setAttributes( { details: next } );
		},
		[ attributes, setAttributes ],
	);
	const addTag = useCallback( () => {
		const next = [ ...( attributes.tags || [] ), '' ];
		setAttributes( { tags: next } );
	}, [ attributes, setAttributes ] );
	const updateTag = useCallback(
		( index: number, value: string ) => {
			const next = [ ...( attributes.tags || [] ) ];
			next[ index ] = value;
			setAttributes( { tags: next } );
		},
		[ attributes, setAttributes ],
	);
	const removeTag = useCallback(
		( index: number ) => {
			const next = [ ...( attributes.tags || [] ) ];
			next.splice( index, 1 );
			setAttributes( { tags: next } );
		},
		[ attributes, setAttributes ],
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title="Dates" initialOpen={ true }>
					<SelectControl
						label="Start Month"
						value={ attributes.startMonth }
						options={ MONTHS }
						onChange={ ( val ) => setAttributes( { startMonth: val } ) }
					/>
					<SelectControl
						label="Start Year"
						value={ attributes.startYear }
						options={ years }
						onChange={ ( val ) => setAttributes( { startYear: val } ) }
					/>
					<SelectControl
						label="End Month"
						value={ attributes.endMonth }
						options={ MONTHS }
						onChange={ ( val ) => setAttributes( { endMonth: val } ) }
					/>
					<SelectControl
						label="End Year"
						value={ attributes.endYear }
						options={ years }
						onChange={ ( val ) => setAttributes( { endYear: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } className={ `${ className } components-placeholder` }>
				<TextControl
					label="Sub Heading"
					value={ attributes.subhead }
					onChange={ ( val ) => setAttributes( { subhead: val } ) }
				/>
				<TextControl
					label="Title"
					value={ attributes.title }
					onChange={ ( val ) => setAttributes( { title: val } ) }
				/>
				<URLInputButton url={ attributes.url } onChange={ ( url ) => setAttributes( { url } ) } />
				<CheckboxControl
					label="Open in new tab?"
					checked={ attributes.target === '_blank' }
					onChange={ ( value ) => {
						setAttributes( { target: value ? '_blank' : '' } );
					} }
				/>

				<section>
					<div>Details</div>
					{ ( attributes.details || [] ).map( ( details, i ) => (
						<div
							key={ i }
							style={ {
								display: 'flex',
								gap: '8px',
								marginTop: '8px',
								alignItems: 'center',
							} }
						>
							<RichText
								tagName="li" // The tag here is the element output and editable in the admin
								allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] } // Allow the content to be made bold or italic, but do not allow other formatting options
								placeholder="List Item..." // Display this text before any content has been added by the user
								value={ details }
								onChange={ ( val ) => updateDetails( i, val ) }
							/>
							<Button isDestructive variant="link" onClick={ () => removeDetails( i ) }>
								Remove
							</Button>
						</div>
					) ) }
					<Button variant="primary" style={ { marginTop: '8px' } } onClick={ addDetails }>
						Add new Item
					</Button>
				</section>

				<section>
					<div>Tags</div>
					{ ( attributes.tags || [] ).map( ( tag, i ) => (
						<div
							key={ i }
							style={ {
								display: 'flex',
								gap: '8px',
								marginTop: '8px',
								alignItems: 'center',
							} }
						>
							<TextControl value={ tag } onChange={ ( val ) => updateTag( i, val ) } />
							<Button isDestructive variant="link" onClick={ () => removeTag( i ) }>
								Remove
							</Button>
						</div>
					) ) }
					<Button variant="primary" style={ { marginTop: '8px' } } onClick={ addTag }>
						Add new Tag
					</Button>
				</section>
			</div>
		</>
	);
}
