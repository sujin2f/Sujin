/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import Edit from './edit';
import metadata from './block.json';

import type { Attributes } from './types';

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 * @todo Typing - but this is official page description :(
 */
registerBlockType< Attributes >( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
} );
