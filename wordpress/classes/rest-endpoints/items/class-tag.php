<?php
/**
 * Tag RESTful API Item
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Rest_Endpoints\Items;

use WP_Term;

// phpcs:disable WordPress.NamingConventions.ValidVariableName.MemberNotSnakeCase
// phpcs:disable WordPress.NamingConventions.ValidVariableName.NotSnakeCaseMemberVar
/**
 * Tag RESTful API Item
 */
class Tag {
	/**
	 * Title of the term
	 *
	 * @var string
	 */
	public $name;

	/**
	 * Slug of the term
	 *
	 * @var string
	 */
	public $slug;

	/**
	 * WordPress ID
	 *
	 * @var int
	 */
	public $termId;

	/**
	 * Create MenuItem from WP_Post
	 *
	 * @param      WP_Term $term WP_Term to create Tag.
	 * @visibility protected
	 */
	public function __construct( WP_Term $term ) {
		$this->name   = $term->name;
		$this->slug   = $term->slug;
		$this->termId = $term->term_id;
	}
}
// phpcs:enable
