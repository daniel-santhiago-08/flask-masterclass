// INICIALIZAÇAO DA PÁGINA
$(function() {

console.log("TESTE")

var clicked;





$("#favorite").click(function(){


    //clicked = $(this).attr("name");
    clicked = "clique";
    console.log(clicked)
    $.ajax({
      type : 'POST',
      url : "/machines/hist",
    //  contentType: 'application/json;charset=UTF-8',
      data : {'name':clicked}
    });
 });
});





