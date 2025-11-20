/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n'

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, RichText } from '@wordpress/block-editor'
import { PanelBody, TextControl, SelectControl, Button } from '@wordpress/components'
import { Fragment } from '@wordpress/element'

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
 * @return {Element} Element to render.
 */
const MONTHS = [
	{ label: __('January', 'resume-block'), value: '01' },
	{ label: __('February', 'resume-block'), value: '02' },
	{ label: __('March', 'resume-block'), value: '03' },
	{ label: __('April', 'resume-block'), value: '04' },
	{ label: __('May', 'resume-block'), value: '05' },
	{ label: __('June', 'resume-block'), value: '06' },
	{ label: __('July', 'resume-block'), value: '07' },
	{ label: __('August', 'resume-block'), value: '08' },
	{ label: __('September', 'resume-block'), value: '09' },
	{ label: __('October', 'resume-block'), value: '10' },
	{ label: __('November', 'resume-block'), value: '11' },
	{ label: __('December', 'resume-block'), value: '12' },
]

function generateYears(start = 1980, end = new Date().getFullYear() + 5) {
	const years = []
	for (let y = end; y >= start; y--) {
		years.push({ label: String(y), value: String(y) })
	}
	return years
}

export default function Edit({ attributes, setAttributes }) {
	const blockProps = useBlockProps()

	const years = generateYears()

	const addDescription = () => {
		const next = [...(attributes.descriptions || []), '']
		setAttributes({ descriptions: next })
	}

	const updateDescription = (index, value) => {
		const next = [...(attributes.descriptions || [])]
		next[index] = value
		setAttributes({ descriptions: next })
	}

	const removeDescription = (index) => {
		const next = [...(attributes.descriptions || [])]
		next.splice(index, 1)
		setAttributes({ descriptions: next })
	}

	const addTag = () => {
		const next = [...(attributes.tags || []), '']
		setAttributes({ tags: next })
	}

	const updateTag = (index, value) => {
		const next = [...(attributes.tags || [])]
		next[index] = value
		setAttributes({ tags: next })
	}

	const removeTag = (index) => {
		const next = [...(attributes.tags || [])]
		next.splice(index, 1)
		setAttributes({ tags: next })
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title={__('Dates', 'resume-block')} initialOpen={true}>
					<SelectControl
						label={__('Start Month', 'resume-block')}
						value={attributes.startMonth}
						options={[{ label: '', value: '' }, ...MONTHS]}
						onChange={(val) => setAttributes({ startMonth: val })}
					/>
					<SelectControl
						label={__('Start Year', 'resume-block')}
						value={attributes.startYear}
						options={[{ label: '', value: '' }, ...years]}
						onChange={(val) => setAttributes({ startYear: val })}
					/>
					<SelectControl
						label={__('End Month', 'resume-block')}
						value={attributes.endMonth}
						options={[{ label: '', value: '' }, ...MONTHS]}
						onChange={(val) => setAttributes({ endMonth: val })}
					/>
					<SelectControl
						label={__('End Year', 'resume-block')}
						value={attributes.endYear}
						options={[{ label: '', value: '' }, ...years]}
						onChange={(val) => setAttributes({ endYear: val })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<TextControl
					label={__('Title', 'resume-block')}
					value={attributes.title}
					onChange={(val) => setAttributes({ title: val })}
				/>

				<div style={{ marginTop: '12px' }}>
					<strong>{__('Descriptions', 'resume-block')}</strong>
					{(attributes.descriptions || []).map((desc, i) => (
						<div key={i} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
							<RichText value={desc} onChange={(val) => updateDescription(i, val)} />
							<Button isDestructive onClick={() => removeDescription(i)}>
								{__('Remove', 'resume-block')}
							</Button>
						</div>
					))}
					<Button isPrimary style={{ marginTop: '8px' }} onClick={addDescription}>
						{__('Add description', 'resume-block')}
					</Button>
				</div>

				<div style={{ marginTop: '12px' }}>
					<strong>{__('Tags', 'resume-block')}</strong>
					{(attributes.tags || []).map((tag, i) => (
						<div key={i} style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
							<TextControl value={tag} onChange={(val) => updateTag(i, val)} />
							<Button isDestructive onClick={() => removeTag(i)}>
								{__('Remove', 'resume-block')}
							</Button>
						</div>
					))}
					<Button isPrimary style={{ marginTop: '8px' }} onClick={addTag}>
						{__('Add tag', 'resume-block')}
					</Button>
				</div>
			</div>
		</Fragment>
	)
}
