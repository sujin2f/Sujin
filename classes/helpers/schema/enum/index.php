<?php
/**
 * Enum Base
 *
 * Minimized or improved from https://github.com/myclabs/php-enum
 *
 * @package    Sujinc.com
 * @subpackage Enum
 * @author     Sujin 수진 Choi <http://www.sujinc.com/>
 * @see        https://github.com/myclabs/php-enum
 */

namespace Sujin\Wordpress\Theme\Sujin\Helpers\Schema;

use ReflectionClass;

use InvalidArgumentException;

abstract class Enum {
    /**
     * Store existing constants in a static cache per object.
     * Key is a const value, and the value is Enum instance.
     *
     * @var Enum[]
     */
    protected static $cache = array();

    /**
     * Selected const key
     *
     * @var string
     */
    protected $const_key;

    /**
     * Origin value
     *
     * @var string
     */
    protected $value;

	private function __construct( string $const_key, string $value ) {
		$this->const_key = $const_key;
		$this->value     = $value;
	}

    /**
     * Get the instance from a string
     *
     * @return Enum
     * @throws InvalidArgumentException
     * @uses   ReflectionClass
     */
	public static function __callStatic( string $value, array $_ ): Enum {
		$class      = get_called_class();
		$reflection = new ReflectionClass( $class );
		$constants  = $reflection->getConstants();

		// Cache exists
		if ( isset( static::$cache[ $value ] ) ) {
			return static::$cache[ $value ];
		}

		foreach ( $constants as $const_key => $const_value ) {
			if (
				// Matched!
				$const_value === $value ||
				// When the member is multiple values: const INT = ['number', 'int', 'integer']
				( is_array( $const_value ) && in_array( $value, $const_value, true ) )
			) {
				$enum = new static( $const_key, $value );

				$enum->const_key = $const_key;
				$enum->value     = $value;

				static::$cache[ $value ] = $enum;

				return $enum;
			}
		}

		throw new InvalidArgumentException( $value . ' is not valid in Enum ' . $class );
	}

    /**
     * Get the value of the instance
     * This will return array when the const is array
     *
     * <code>
     * <?php
     * $integer = new Number( 'int' );
     *
     * switch ( $integer->case() ) {
     *     case Number::FLOAT:
     *         do_somthing();
     *         break;
     *
     *     case Number::INT:
     *         do_somthing();
     *         break;
     * }
     * ?>
     * </code>
     *
     * @return string|string[]
     */
	public function case() {
		return constant( get_called_class() . '::' . $this->const_key );
	}

    /**
     * Get the original value of the instance
     *
     * @return string
     */
	public function value(): string {
		return $this->value;
	}
}
