<?php
namespace Apple_Exporter\Components;

/**
 * An embedded video from Youtube or Vimeo, for example. For now, assume
 * any iframe is an embedded video.
 *
 * @since 0.2.0
 */
class Embed_Web_Video extends Component {

	/**
	 * Regex patterns to match supported embed types.
	 */
	const YOUTUBE_MATCH = '#^https?://(?:www\.)?(?:youtube\.com/((watch\?v=)|(embed/))([\w\-]+)|youtu\.be/([\w\-]+))[^ ]*$#';
	const VIMEO_MATCH   = '#^(https?:)?//(?:.+\.)?vimeo\.com/(:?.+/)?(\d+)(?:\?.*)*$#';

	/**
	 * Look for node matches for this component.
	 *
	 * @param DomNode $node
	 * @return mixed
	 * @static
	 * @access public
	 */
	public static function node_matches( $node ) {
		// Is this node valid for further processing?
		if ( self::is_embed_web_video( $node, self::YOUTUBE_MATCH )
			|| self::is_embed_web_video( $node, self::VIMEO_MATCH ) ) {
			return $node;
		}

		return null;
	}

	/**
	 * Register all specs for the component.
	 *
	 * @param string $text
	 * @access protected
	 */
	public function register_specs() {
		$this->register_spec(
			'json',
			__( 'JSON', 'apple-news' ),
			array(
				'role'        => 'embedwebvideo',
				'aspectRatio' => '%%aspectRatio%%',
				'URL'         => '%%URL%%',
			)
		);
	}

	/**
	 * Test if this node is a match based on the node type and URL format.
	 *
	 * @param DomNode $node
	 * @param string $pattern
	 * @return boolean
	 * @static
	 * @access public
	 */
	public static function is_embed_web_video( $node, $pattern ) {
		return (
			( 'p' == $node->nodeName && preg_match( $pattern, trim( $node->nodeValue ) ) )
			|| ( 'iframe' == $node->nodeName && preg_match( $pattern, trim( $node->getAttribute( 'src' ) ) ) )
		);
	}

	/**
	 * Build the component.
	 *
	 * @param string $text
	 * @access protected
	 */
	protected function build( $text ) {
		$aspect_ratio = 1.777;
		$src = $url = null;

		// If a paragraph was matched, it's because it contains a EWV URL.
		// The URL could be linked if it was generated by the [embed] shortcode.
		//
		// If it's an iframe, just get the src attribute.
		if ( preg_match( '#<p(.*?)>(<a(.*?)>)?(.*?)(</a>)?</p>#', $text, $matches ) ) {
			$url = trim( $matches[4] );
		} else if ( preg_match( '#<iframe(.*?)src="(.*?)"(.*?)>#', $text, $matches ) ) {
			$url = trim( $matches[2] );
		}

		if ( ! empty( $url ) ) {
			if ( preg_match( self::YOUTUBE_MATCH, $url, $matches ) ) {
				$src = 'https://www.youtube.com/embed/' . end( $matches );
			} else {
				preg_match( self::VIMEO_MATCH, $url, $matches );
				$src = 'https://player.vimeo.com/video/' . end( $matches );
			}
		}

		$this->register_json(
			'json',
			array(
				'aspectRatio' => round( floatval( $aspect_ratio ), 3 ),
				'URL'         => $src,
			)
	 );
	}

}
