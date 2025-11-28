---
layout: null
sitemap:
exclude: 'yes'
---

$(document).ready(function () {
    const powerUps = [56,56,50,50,52,54,52,54,98,97];
    var powerUpProgression = [...powerUps];
    $('#navbar').removeClass('hidden');
    $('#projects-toggle').removeClass('hidden');
    $('#mobile-bar').removeClass('hidden');
    $('#js-hint').addClass('hidden');

    function togglePanel(buttonID, panelID, hidePanelID1, hidePanelID2) {
        $(buttonID).toggleClass('panel-button-pressed');
    
        if ($('.content-wrapper').hasClass('showing')) {
            $(hidePanelID1).hide(); // Hide the first panel not in focus
            $(hidePanelID2).hide(); // Hide the second panel not in focus
            $(panelID).hide(); // Hide the current panel and show the panel-cover
            $('.content-wrapper').removeClass('animated slideInRight');
            $('.panel-cover').removeClass('panel-cover--collapsed');
            $('.panel-cover').css('max-width', '100%');
            $('.panel-cover').animate({'width': '100%'}, 400, 'swing', function () {});
            $('#navbar').animate({'width': '100%'}, 400, 'swing', function () {});
            $('.content-wrapper').removeClass('showing');
        } else {
            let currentWidth = $('.panel-cover').width();
            $(hidePanelID1).hide(); // Hide the first panel not in focus
            $(hidePanelID2).hide(); // Hide the second panel not in focus
            $(panelID).show(); // Show the panel associated with the button pressed
    
            if (currentWidth < 960) {
                $('.panel-cover').addClass('panel-cover--collapsed');
                $('.content-wrapper').addClass('animated slideInRight');
            } else {
                $('.panel-cover').css('max-width', currentWidth);
                $('.panel-cover').animate({'max-width': '1000px', 'width': '40%'}, 400, 'swing', function () {});
                $('#navbar').animate({'width': $('#projects-toggle').width()}, 400, 'swing', function () {});
            }
            $('.content-wrapper').addClass('showing');
        }
    }
    
    $('#projects-button').click(function(e) {
        togglePanel('#projects-button', '#projects-panel', '#now-panel', '#pgp-panel', '#ctf-panel');

        if ($(window).width() < 768) {  // Checking if it is a mobile device based on the width
            $('#pgp-panel p').hide();  // Hiding the text
        } else {
            $('#pgp-panel p').show();  // Showing the text on non-mobile devices
        }
    });
    
    $('#now-button').click(function(e) {
        togglePanel('#now-button', '#now-panel', '#projects-panel',  '#pgp-panel', '#ctf-panel');

        if ($(window).width() < 768) {  // Checking if it is a mobile device based on the width
            $('#pgp-panel p').hide();  // Hiding the text
        } else {
            $('#pgp-panel p').show();  // Showing the text on non-mobile devices
        }
    });

    $('#pgp-button').click(function(e) {
        togglePanel('#pgp-button', '#pgp-panel', '#projects-panel', '#now-panel', '#ctf-panel');
        
        if ($(window).width() < 768) {  // Checking if it is a mobile device based on the width
            $('#pgp-panel p').hide();  // Hiding the text
        } else {
            $('#pgp-panel p').show();  // Showing the text on non-mobile devices
        }
    });

    $('#ctf-button').click(function(e) {
    togglePanel('#ctf-button', '#ctf-panel', '#projects-panel', '#now-panel', '#pgp-panel');
    
    if ($(window).width() < 768) {  // Checking if it is a mobile device based on the width
        $('#pgp-panel p').hide();  // Hiding the text
    } else {
        $('#pgp-panel p').show();  // Showing the text on non-mobile devices
    }
    });
    
    
    

    $('#btn-mobile-menu').click(function () {
        $('.navigation-wrapper').toggleClass('visible')
        $('#btn-mobile-menu').toggleClass('hidden')
        $('#btn-mobile-close').toggleClass('hidden')
    })

    $('#btn-mobile-close').click(function () {
        $('.navigation-wrapper').toggleClass('visible')
        $('#btn-mobile-close').toggleClass('hidden')
        $('#btn-mobile-menu').toggleClass('hidden')
    })

    $(document).keypress(function(event){
        if (powerUpProgression.length > 0) {
            if (powerUpProgression[0] === event.which) {
                powerUpProgression.splice(0,1)
                if (powerUpProgression.length === 0) {
                    document.getElementById('profile-image').src = "{{ site.baseurl }}/images/profile_pixelated.jpg";
                    document.getElementById('background-image').style.backgroundImage = "url({{ site.baseurl }}/images/cover_pixelated.jpg)"
                }
            } else {
                powerUpProgression = [...powerUps];
            }
        }         
    })
})