getEntries();

function getEntries() {

    $.ajax({
        //url: "https://gdata.youtube.com/feeds/api/playlists/PL48A83AD3506C9D36?v=2&alt=json",
        url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=PL48A83AD3506C9D36&key=AIzaSyAyvig5VkfPt_lBR4sFl-ajsULtgUHmTwA",
        dataType: "jsonp",

        success: function(data) {
            var video_id = "";
            $.each(data.items, function(i, item) {
                video_id = video_id + item.snippet.resourceId.videoId + ',';
            });
            video_id = video_id.substring(0, video_id.length - 1);
            console.log(video_id);
            $.ajax({
                url: "https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cstatistics%2Csnippet%2Cplayer&id=" + video_id + "&key=AIzaSyAyvig5VkfPt_lBR4sFl-ajsULtgUHmTwA",
                dataType: "jsonp",

                success: function(data) {
                    $.each(data.items, function(i, item) {
                        var title = item.snippet.title;
                        var thumb = item.snippet.thumbnails.default.url;
                        var numLikes = item.statistics.likeCount;
                        var numDislikes = item.statistics.dislikeCount;
                        var viewCount = item.statistics.viewCount;

                        $('#entries tbody').append("<tr><td id='editinplace'>" + title + "</td> <td><img alt='" + title + "' src='" + thumb + "'></img></td><td>" + numLikes + "</td><td>" + numDislikes + "</td><td>" + viewCount + "</td>" + "<td style='display: none' id='delete'><input type='button' class='del' value='Delete'/></td>" + "</tr>");
                    });
                    $("table").trigger("update");
                    setEditInPlace();
                }
            });

            $("table").trigger("update");
            setEditInPlace();
        }
    });

}

setEditInPlace();

function setEditInPlace() {
    $("td").each(function() {
        var id = $(this).attr("id");
        if (id == 'editinplace') {
            $(this).editInPlace({
                callback: function(unused, enteredText) {
                    return enteredText;
                },
                show_buttons: true
            });
        }
    });
}
$(document).ready(function() {

    $("#entries").tablesorter();

    $("#edit").click(function() {
        var text = $("#edit").val();
        if (text == 'edit') {
            $("#edit").val('Close it');
            $("td").each(function() {
                var id = $(this).attr("id");
                if (id == 'delete') $(this).show('slow');
            });
        } else {
            $("#edit").val('edit');
            $("td").each(function() {
                var id = $(this).attr("id");
                if (id == 'delete') $(this).hide('slow');
            });
        }
    });
    $('.del').live('click', function() {
        $(this).parent().parent().remove();
        $("#entries").trigger("update");
    });
});