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
function universitySearchResults($data){
    $query = new WP_Query(array(
        'post_type' => array('post', 'page', 'professor', 'program', 'campus', 'event'),
        's'         => sanitize_text_field($data['term']), // s = search ex : wp-json/university/v1/search?term=meowsalot
    ));

    $results = array(
        'generalInfo'   => array(),
        'professors'    => array(),
        'programs'      => array(),
        'events'        => array(),
        'campuses'      => array()
    );

    while($query->have_posts()){
        $query->the_post();

        if(get_post_type() == 'post' OR get_post_type() == 'page'){
            array_push($results['generalInfo'], array(
                'title'     => get_the_title(),
                'permalink' => get_the_permalink(),
                'postType'  => get_post_type(),
                'authorName'=> get_the_author(),
                'type-name' => 'General Information'
            ));
        }
        if(get_post_type() == 'professor'){
            array_push($results['professors'], array(
                'title'     => get_the_title(),
                'permalink' => get_the_permalink(),
                'image'     => get_the_post_thumbnail_url(0, 'professorLandscape') 
            ));
        }
        if(get_post_type() == 'program'){
            array_push($results['programs'], array(
                'title'     => get_the_title(),
                'permalink' => get_the_permalink(),
            ));
        }
        if(get_post_type() == 'event'){
            $eventDate = new DateTime(get_field('event_date')); 
            $description = (has_excerpt()) ? get_the_excerpt() : wp_trim_words(get_the_content(), 15); 
            array_push($results['events'], array(
                'title'     => get_the_title(),
                'permalink' => get_the_permalink(),
                'month'     => $eventDate->format('M'),
                'day'       => $eventDate->format('d'),
                'description' => $description
            ));
        }        
        if(get_post_type() == 'campus'){
            array_push($results['campuses'], array(
                'title'     => get_the_title(),
                'permalink' => get_the_permalink(),
            ));
        }
    }

    return $results;
}