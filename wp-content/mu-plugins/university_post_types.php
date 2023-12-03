<?php

/* PHP Debugger in console */
function debug_to_console($data, $context = 'Debug in Console') {
    // Buffering to solve problems frameworks, like header() in this and not a solid return.
    ob_start();
    $output  = 'console.info(\'' . $context . ':\');';
    $output .= 'console.log(' . json_encode($data) . ');';
    $output  = sprintf('<script>%s</script>', $output);
    echo $output;
}
add_action('wp_enqueue_scripts', 'debug_to_console');

function university_post_types(){

    // Event Post type
    register_post_type('event', array(
        'show_in_rest'      => true,
        'supports'          => array('title','editor', 'excerpt'),
        'rewrite'           => array('slug' => 'events'),
        'has_archive'       => true,
        'public'            => true,
        'labels'            => array(
            'name'                  => __('Events'),
            'singular_name'         => __('Event'),
            'add_new'               => __('Add New Event'),
            'add_new_item'          => __('Add New Event'),
            'edit_item'             => __('Edit Event'),
            'all_items'             => __('All Events'),
            'not_found'             => __( 'No Events found.' ),
            'not_found_in_trash'    => __( 'No Events found in Trash.' ),
        ),
        'menu_icon'         => 'dashicons-calendar'
    ));

    // Program Post type
    register_post_type('program', array(
        'show_in_rest'      => true,
        'supports'          => array('title','editor'),
        'rewrite'           => array('slug' => 'programs'),
        'has_archive'       => true,
        'public'            => true,
        'labels'            => array(
            'name'                  => __('Programs'),
            'singular_name'         => __('Program'),
            'add_new'               => __('Add New Program'),
            'add_new_item'          => __('Add New Program'),
            'edit_item'             => __('Edit Program'),
            'all_items'             => __('All Programs'),
            'not_found'             => __( 'No Programs found.' ),
            'not_found_in_trash'    => __( 'No Programs found in Trash.' ),
        ),
        'menu_icon'         => 'dashicons-awards'
    ));

    // Professor Post type
    register_post_type('professor', array(
        'show_in_rest'      => true,
        'supports'           => array('title', 'editor', 'thumbnail'), 
        'public'            => true,
        'labels'            => array(
            'name'                  => __('Professors'),
            'singular_name'         => __('Professor'),
            'add_new'               => __('Add New Professor'),
            'add_new_item'          => __('Add New Professor'),
            'edit_item'             => __('Edit Professor'),
            'all_items'             => __('All Professors'),
            'not_found'             => __( 'No Professors found.' ),
            'not_found_in_trash'    => __( 'No Professors found in Trash.' ),
        ),
        'menu_icon'         => 'dashicons-welcome-learn-more'
    ));
}
add_action('init', 'university_post_types');

function currentLink($pageName, $pageId) {
    $currentLink = (is_page($pageName) || wp_get_post_parent_id(0) === $pageId) ? 'class="current-menu-item"' : "";
    return $currentLink;
}
add_action('set_current_link_active', 'currentLink', 1, 2);

function postTypeLink($post_type) {
    if($post_type === 'event'){
        $curr_link = (get_post_type() == $post_type || is_page('past-events')) ? 'class="current-menu-item"' : "";
    }else{
        $curr_link = (get_post_type() == $post_type) ? 'class="current-menu-item"' : "";        
    }
    return $curr_link;
} 
add_action('set_post_type_link_active', 'postTypeLink', 1, 1);
