/**
 * Created by Diego on 8/14/14.
 */

$(document).ready(function() {

    var mFirstGameLoad = false;

    function onGameSelected(aElement) {
        var aGameIframe = $('#game_iframe');
        aGameIframe.attr("src", aElement.attr('game-url'));

        $(document).scrollTop(0);

        if (mFirstGameLoad == false) {
            mFirstGameLoad = true;
            aGameIframe.animate({height: 640}, 500);
        }
    }

    function loadLogo() {
        var portal = Tools.getQueryString('portal', '@demo');
        var logo_path = 'https://s3.amazonaws.com/gcn-static-assets/uploaded/assets/portal/' + portal + '.png';
        document.getElementById('portal-logo').src = logo_path;
    }

    var aSelectableGames = $('.selectable_game');

    aSelectableGames.each(function() {
        Tools.addTouchEvents($(this), onGameSelected, $(this));
    });
    
    loadLogo();

});