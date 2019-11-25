<?php
/**
 * Class : JSON Schema -- Reference
 *
 * @project Sujin
 * @since   9.0.0
 * @author  Sujin 수진 Choi http://www.sujinc.com/
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

final class Reference {
	private $path = '';
	private $base = null;
	private $key  = null;

	public $properties = array();

	public function __construct( string $path, ?Schema $base = null, ?string $key = null ) {
		$this->path = $path;
		$this->base = $base;
		$this->key  = $key;

		$path = explode( '/', $this->path );

		// In a same file
		if ( '#' === $path[0] ) {
			array_shift( $path );
			$schema = $this->get_schema_from_base( $path );
		} else {
			$key    = substr( $this->path, 0, -5 );
			$schema = Schema::get_instance( $key );

			if ( ! $schema->initialized ) {
				$schema = Schema::load( $this->base->base_dir . '/' . $this->path );
			}
		}

		$this->properties = $schema->properties;
	}

	public function validate( object $object, string $key, ?bool $return = null ) {
		foreach ( $this->properties as $key => $property ) {
			if ( $this->key) {
				$object->{$this->key}->$key = $property->validate( $object->{$this->key}, $key, true );
				continue;
			}

			$object->$key = $property->validate( $object, $key, true );
		}
	}

	private function get_schema_from_base( array $path, $schema = null ) {
		if ( ! $schema ) {
			$schema = $this->base;
		}

		$key   = array_shift( $path );
		$child = is_array( $schema ) ? $schema[ $key ] : $schema->$key;

		if ( empty( $path ) ) {
			return $child;
		}

		return $this->get_schema_from_base( $path, $child );

	}
}
