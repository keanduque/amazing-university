<?php get_header(); 
    pageBanner(array(
        'title'     => 'All Campuses',
        'subtitle'  => 'We have several conveniently located campuses.'
    ));
?>
    <div class="container container--narrow page-section">  
        <div class="link-list min-list">
            <?php while(have_posts()) : the_post(); ?>
                <li><a href="<?php the_permalink(); ?>"><?php the_title(); 
                    $mapLocation = get_field('map_location');
                    echo $mapLocation;
                ?></a></li>
            <?php endwhile;?>
        </div>

    </div>
<?php get_footer(); ?>