<?php
/**
 * Test data -- Attachment
 *
 * @package sujinc.com
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

/**
 * Test data -- Category
 */
class Data_Attachment {
	/**
	 * Attachment 1 ID
	 *
	 * @var WP_Post
	 */
	public $attachment_01;

	/**
	 * Attachment 2 ID
	 *
	 * @var WP_Post
	 */
	public $attachment_02;

	/**
	 * Constructor
	 */
	public function __construct( $factory ) {
		$taxonomy = new Data_Taxonomy();

		$attachment_id_01 = $factory->attachment->create_upload_object(
			DIR_TESTDATA . '/images/test-image.png',
			0
		);
		wp_set_object_terms(
			$attachment_id_01,
			$taxonomy->category_background->name,
			'category'
		);
		$posts = get_posts(
			array(
				'post_type' => 'attachment',
				'include'   => array(
					$attachment_id_01,
				),
			)
		);

		$this->attachment_01 = $posts[0];

		$attachment_id_02 = $factory->attachment->create_upload_object(
			DIR_TESTDATA . '/images/canola.jpg',
			0
		);
		wp_set_object_terms(
			$attachment_id_02,
			$taxonomy->category_background->name,
			'category'
		);
		$posts = get_posts(
			array(
				'post_type' => 'attachment',
				'include'   => array(
					$attachment_id_01,
				),
			)
		);

		$this->attachment_02 = $posts[0];
	}
}
