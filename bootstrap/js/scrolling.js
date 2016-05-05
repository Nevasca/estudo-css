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
})

