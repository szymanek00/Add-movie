$(function(){
    console.log('DOM');

    var url = 'http://localhost:3000';
    var ul = $('.repertuar');

    function insertMovies(movies) {
        ul.empty();
        for(var i=0; i<movies.length; i++) {
            var movie = movies[i];

            var li = $('<li>');
            var h3 = $('<h3>');
            var p = $('<p>');
            var remove = $('<button class="remove">remove</button>');
            var update = $('<button class="update">update</button>');

            li.attr('data-id', movie.id);
            h3.text(movie.title);
            p.text(movie.description);

            li.append(h3);
            li.append(p);
            li.append(remove);
            li.append(update);
            ul.append(li);

        }
    }

    function loadMovies() {
        var $ajax = $.ajax({
            url: url + '/movies',
            method: 'GET',
        });

        $ajax.done(function(resp){
            console.log(resp);
            insertMovies(resp);
        });

        $ajax.fail(function(err){
            console.log(err);
        })
    }

    function addMovies() {
        var title = $('.get_title');
        var desc = $('.get_description');
        var form = $('.add_movie');

        form.on('submit', function(event){
            event.preventDefault();

            var titleVal = title.val();
            var descVal = desc.val();

            var movie = {
                title: titleVal,
                description: descVal
            }

            console.log(movie);

            $.ajax({
                url: url+ '/movies',
                method: 'POST',
                dataType: 'json',
                data: movie,
            }).done(function(resp) {
                console.log(resp);
                loadMovies();
            }).fail(function(err){
                console.log(err);
            })
        })
    }


    function removeMovie() {
        ul.on('click', '.remove', function(){
            var id = $(this).parent().attr('data-id');

            $.ajax({
                url: url + '/movies/'+id,
                method: 'DELETE',
                dataType: 'json',
            }).done(function(resp){
                console.log(resp);
                loadMovies();
            }).fail(function(err){
                console.log(err);
            })
        })
    }

    function updateMovie() {
        ul.on('click', '.update', function(){
            var li = $(this).parent()
            var id = li.attr('data-id');


            if(li.find('h3').is('[contenteditable=true]')) {
                li.find('h3, p').attr('contenteditable', false);
                li.css('border', '');
                $(this).text('update');

                movie = {
                    title: li.find('h3').text(),
                    description: li.find('p').text()
                }

                $.ajax({
                    url: url + '/movies/'+id,
                    method: 'PUT',
                    dataType: 'json',
                    data: movie,
                }).done(function(resp){
                    console.log(resp);
                    loadMovies();
                }).fail(function(err){
                    console.log(err);
                });
            } else {
                li.find('h3, p').attr('contenteditable', true);
                li.css('border', '1px solid green');
                $(this).text('confirm');
            }


        })
    }

    loadMovies();
    addMovies();
    removeMovie();
    updateMovie();

})
