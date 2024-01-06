<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch(){
    //1st param: university - namespace you can also include version using /v1 etc.
    //2nd param: route - base url or path name
    register_rest_route('university/v1', 'search', array(
        'methods'   => WP_REST_Server::READABLE, // equivalent to GET
        'callback'  => 'universitySearchResults'
    ));
}
// WP will automatically converted PHP data into JSON data
function universitySearchResults(){
    $professors = new WP_Query(array(
        'post_type' => 'professor',
    ));

    return $professors->post;
}