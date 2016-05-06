$(function() {
    //Para alterar o tamanho da imagem de fundo
    $(window).on("load resize", function() {
        $(".fill-screen").css("height", window.innerHeight);
    });

    //Para adicionar videos como 'imagem' de fundo
    $("#video-wallpaper").wallpaper({
        source: {
            poster: "imgs/PigeonsAttack.png",
            video: "//www.youtube.com/embed/iJYbiAZ8PaY"
        }
    });
    
    //add Bootstrap's scrollspy
    $('body').scrollspy({
        target: '.navbar',
        offset: 160
    });
    
    //Smooth scrolling
    $('nav a, .down-button a').bind('click', function() {
        $('html, body').stop().animate({
            scrollTop: $($(this).attr('href')).offset().top - 100
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
    
    //parallax scrolling with stellar.js
    $(window).stellar();
    //para usar stellar, colocar isso no elemento com o bg-image:
    //class="stellar-bg" data-stellar-background-ratio="0.2"

    //Inicializa o WOW
    new WOW().init();

    //Inicializa a galeria
    $(document).ready(function () {
      $("#nanoGallery3").nanoGallery();
    });

})

