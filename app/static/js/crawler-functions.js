// INICIALIZAÇAO DA PÁGINA
$(function() {

    // INICIALIZAÇÃO DE VARIÁVEIS
    var etapa = 'inicial';
    var filter_element_id = "#filters-list";

    // REQUISIÇÃO PARA OBTER A LISTA DE CAMPOS DO MODELO
    result = get_fields_ajax(url)
    result[0] = fields_dictionary
    result[1] = rows_per_page
    result[2] = order_by
    result[3] = filtered_fields
    result[4] = fillObject
    result[5] = date_field
    filters_dictionary = get_fields_dictionary(
                            filtered_fields,
                            fields_dictionary)

    // CRIAÇÃO DO FILTRO
    createFilter(filters_dictionary, filter_element_id)

    ajax_call(etapa, url, rows_per_page, order_by, filter_element_id, fillObject, date_field)

    // FILTROS
    filters = $(filter_element_id).find("input")
    $.each(filters,function(key,filter) {
        $("#"+filter['id']).bind('change keyup', function(e) {
            ajax_call(etapa, url, rows_per_page, order_by, filter_element_id, fillObject, date_field)
        })
    });

    // PAGINAÇÃO
    $('.btn-group button').on('click', function(e) {
        etapa = 'pagination';
        $('.btn-group button').not(this).removeClass("active");
        $(this).addClass("active");

        ajax_call(etapa, url, rows_per_page, order_by, filter_element_id, fillObject, date_field)

        id = $(this).attr("id");
        middle_pages = ['previous-page', 'current-page', 'next-page'];
        check = middle_pages.includes(id);
        if (check){
            $(this).removeClass("active");
        }
    });


    // ORDERNAÇÃO
    $('.thead').on('click', 'i.fa' ,function() {
        etapa = 'sort';
        $(".thead").find("i").css('color', 'black');

        field_asc = $(this).attr("id").split('-')[0]

        if (order_by == field_asc){
            order_by = '-'.concat(field_asc);
        }else if (order_by == '-'.concat(field_asc)){
            order_by = field_asc;
        }else{
            order_by = field_asc;
        }
        ajax_call(etapa, url, rows_per_page, order_by, filter_element_id, fillObject, date_field)
    });

});

function get_fields_ajax(url){

    var filters_dictionary;

    console.log("get_fields_ajax")
    console.log(url)

    $.ajax({
    async: false,
    type: 'POST',
    url: url,
    data: {
        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
        etapa: 'inicial'
    },
    success: function(result){

        console.log(result);

        fields_json = result['fields_dictionary'];
        rows_per_page = result['rows_per_page'];
        order_by = result['order_by'];
        filtered_fields = result['filtered_fields'];
        fillObject = result['fillObject'];
        date_field = result['date_field'];


        var dict = []
        for (i=0; i<fields_json['field_name'].length; i++){

            dict[i] = {
             'field_name': fields_json['field_name'][i],
             'label_name': fields_json['label_name'][i],
             'fields_type': fields_json['fields_type'][i],
             'type': fields_json['type'][i]}
            }

        fields_dictionary = dict
        }
    });

    return [fields_dictionary, rows_per_page, order_by, filtered_fields, fillObject, date_field];


}


function get_fields_dictionary(filtered_fields, fields_dictionary){

    filters_dictionary = []

    for (i=0; i<filtered_fields.length; i++){
        $.each(fields_dictionary, function(key,filter) {
            if (filter.field_name == filtered_fields[i]){
                filters_dictionary[i] = {
                 'field_name':filter.field_name,
                 'label_name': filter.label_name,
                 'fields_type': filter.fields_type,
                 'type': filter.type }
            }
        });
    }

    return filters_dictionary;

}




function createFilter(filters_dictionary, filter_element_id ){


    $.each(filters_dictionary, function (index, filter_field) {

        if ( filter_field.type == 'date'){
            input_group_id = "input-group-"+filter_field.field_name+"_inicial"
            input_group = $("<div id="+input_group_id+" class='input-group input-group-sm mb-2'></div>").text('');
            $(filter_element_id).append(input_group);

            ig_prepend_id = "input-group-prepend-"+filter_field.field_name+"_inicial"
            ig_prepend_class = "input-group-prepend justify-content-center mb-1"
            input_group_prepend = $("<div id="+ig_prepend_id+" class='"+ig_prepend_class+"' style='width: 100%;'></div>").text('');
            $("#"+input_group_id).append(input_group_prepend);

            input_group_text_id = "input-group-text-"+filter_field.field_name+"_inicial"
            input_group_text = $("<span id="+input_group_text_id+"  style='font-weight: bold;' class='input-group-text'></div>").text(filter_field.label_name+" Inicial");
            $("#"+ig_prepend_id).append(input_group_text);


            input_search_id = filter_field.field_name+"_inicial"+"_search"
//            input_search = $("<input type="+filter_field.type+" id="+input_search_id+" class='form-control mx-2'>").text('');
            input_search = $("<input type="+filter_field.type+" id="+input_search_id+" class='form-control'>").text('');
            $("#"+input_group_id).append(input_search);

            /////////////////////////////////////////////////////////////

            input_group_id = "input-group-"+filter_field.field_name+"_final"
            input_group = $("<div id="+input_group_id+" class='input-group input-group-sm mb-2'></div>").text('');
            $(filter_element_id).append(input_group);

            ig_prepend_id = "input-group-prepend-"+filter_field.field_name+"_final"
            ig_prepend_class = "input-group-prepend justify-content-center mb-1"
            input_group_prepend = $("<div id="+ig_prepend_id+" class='"+ig_prepend_class+"' style='width: 100%;'></div>").text('');
            $("#"+input_group_id).append(input_group_prepend);

            input_group_text_id = "input-group-text-"+filter_field.field_name+"_final"
            input_group_text = $("<span id="+input_group_text_id+" style='font-weight: bold;' class='input-group-text'></div>").text(filter_field.label_name+" Final");
            $("#"+ig_prepend_id).append(input_group_text);


            input_search_id = filter_field.field_name+"_final"+"_search"
//            input_search = $("<input type="+filter_field.type+" id="+input_search_id+" class='form-control mx-2'>").text('');
            input_search = $("<input type="+filter_field.type+" id="+input_search_id+" class='form-control'>").text('');
            $("#"+input_group_id).append(input_search);


        }else{
            input_group_id = "input-group-"+filter_field.field_name
            input_group = $("<div id="+input_group_id+" class='input-group input-group-sm mb-2'></div>").text('');
            $(filter_element_id).append(input_group);

            ig_prepend_id = "input-group-prepend-"+filter_field.field_name
            ig_prepend_class = "input-group-prepend justify-content-center mb-1"
            input_group_prepend = $("<div id="+ig_prepend_id+" class='"+ig_prepend_class+"' ></div>").text('');
            $("#"+input_group_id).append(input_group_prepend);

            input_group_text_id = "input-group-text-"+filter_field.field_name
            input_group_text = $("<span id="+input_group_text_id+" style='font-weight: bold;' class='input-group-text'></div>").text(filter_field.label_name);
            $("#"+ig_prepend_id).append(input_group_text);


            input_search_id = filter_field.field_name+"_search"
//            input_search = $("<input type="+filter_field.type+" id="+input_search_id+" class='form-control mx-2'>").text('');
            input_search = $("<input type="+filter_field.type+" id="+input_search_id+" class='form-control'>").text('');
            $("#"+input_group_id).append(input_search);

        }
    })
}




function result_actions(result, order_by, fillObject, date_field){
    console.log(result)
    object_list = result['object_list']
    first_page = result['first_page'];
    previous_page = result['previous_page'];
    current_page = result['current_page'];
    next_page = result['next_page'];
    last_page = result['last_page'];
    fields_list = result['fields_list'];
    field_names_order = result['field_names_order'];
//    date_field = result['date_field'];


    if (next_page >= last_page){
        next_page = last_page;
        $("#next-page").addClass("d-none");
    }else{
        $("#next-page").removeClass("d-none");
    }

    if (previous_page <= first_page){
        previous_page = first_page;
        $("#previous-page").addClass("d-none");
    }else{
        $("#previous-page").removeClass("d-none");
    }

    if ((current_page >= last_page) || (current_page <= first_page)) {
        $("#current-page").addClass("d-none");
        if (current_page >= last_page)  {
            current_page = last_page;
        }
        if (current_page <= first_page) {
            current_page = first_page;
        }
    }else{
        $("#current-page").removeClass("d-none");
        $("#current-page").addClass("active");

    }

    $("#first-page").text(first_page);
    $("#previous-page").text(previous_page);
    $("#current-page").text(current_page);
    $("#next-page").text(next_page);
    $("#last-page").text(last_page);


    if (fillObject == 'table'){
        createFillTable(object_list, fields_list, field_names_order, order_by, date_field)
    }else if(fillObject == 'image'){
        createFillImages(object_list, fields_list, field_names_order, order_by, date_field)
    }


}



function ajax_call(etapa, url, rows_per_page, order_by, filter_element_id, fillObject, date_field){

    filters = $(filter_element_id).find("input");
    json_filters = {}
    $.each(filters, function(key,data) {
        json_filters[data['id']] = data['value']
    })

    $.ajax({
    type: 'POST',
    url: url,
    data: {
        csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val(),
        filter_values: JSON.stringify(json_filters),
        rows_per_page: rows_per_page,
        current_page: $('.btn-group button.active').text(),
        order_by: order_by
    },
    success: function(result){
        if (etapa == 'inicial') {
//            $('#data_de_extracao_inicial_search').attr('value', result['min_date']);
            $('#'+date_field+'_inicial_search').attr('value', result['min_date']);
//            $('#data_de_extracao_final_search').attr('value', result['max_date']);
            $('#'+date_field+'_final_search').attr('value', result['max_date']);
        }

        result_actions(result, order_by, fillObject, date_field)
    }
    });
}


function createFillTable(object_list,fields_list,field_names_order, order_by, date_field){

    $("#table-fill-header").empty();
    $("#table-fill-body").empty();

    order_by_column = order_by.replace('-','');
    if (order_by.search('-')){
        icon_class = 'fa fa-chevron-up ml-2'
    }else{
        icon_class = 'fa fa-chevron-down ml-2'
    }

    // CRIAÇÃO DO HEADER

    console.log("Loop object_list");
    console.log(object_list.slice(0,1));
//    field_names_order = ['id','loja','produto','data_de_extracao','preco'];
    var object_list_new_order = JSON.parse(JSON.stringify( object_list, field_names_order , 4));
    console.log(object_list_new_order);

    if ( field_names_order.length > 0){
        object_list = JSON.parse(JSON.stringify( object_list, field_names_order , 4));
    }


    $.each(object_list.slice(0,1), function (row, data) {
        table_row = $("<tr></tr>").text('')
        $("#table-fill-header").append(table_row);
        $.each(data, function (column, data) {
            var th_id = "header-".concat(column);
            var th_style = "'white-space: nowrap; text-transform:capitalize;'"
            var th_tag = "<th id="+th_id+" style="+th_style+"></th>";
            if (column == order_by_column){
                var i_tag = "<i class='"+icon_class+"' style='color: #27A2FC;' id='"+column+"-order'></i>"
            }else{
                var i_tag = "<i class='fa fa-chevron-down ml-2' id='"+column+"-order'></i>"
            }

            var table_head_row = $(th_tag).text(column);
            var table_head_row_head = $(i_tag).text('');

            $("#table-fill-header tr").append(table_head_row);
            var th_id = "header-".concat(column);
            $("#"+th_id).append(table_head_row_head)
        })
    })
    // CRIAÇÃO E PREENCHIMENTO DO BODY
//    $.each(object_list.slice(0,num), function (row, data) {
    $.each(object_list, function (row, data) {
        id_row_name = "table-row-".concat(row)
        bg = "this.style.background='lightgray';"
        mouse_over = "this.bgColor='white'"
        var table_row = $("<tr id="+id_row_name+" onmouseover=\"this.style.background='lightgray';\"  onmouseout=\"this.style.background='';\" ></td>").text('');
        $("#table-fill-body").append(table_row)

        $.each(data, function (column, data) {
            for (col=0; col < fields_list.length; col++){
                if (fields_list[col] == column){
                    id_name = "object_list-".concat(column,'-',row)
                    var table_data;
                    if ( column == date_field ){
                        table_data = $("<td id="+id_name+"></td>").
                            text(formatDate(data));

                    }else{
                        table_data = $("<td id="+id_name+"></td>").text(data);
                    }
                    $("#"+id_row_name).append(table_data);
                }
            }
        })

    })

}




function createFillImages(object_list,fields_list,field_names_order, order_by, date_field){

    $("#image-card-body").empty();

    // CRIAÇÃO E PREENCHIMENTO DO CARD
    $.each(object_list, function (row, data) {
        id_row_name = "table-row-".concat(row)
        zoomIn = " onmouseover=\"this.style.background='#E5F1FB '; this.style.color='#6F757A';  \" "
        zoomOut = " onmouseout=\"this.style.background='';  this.style.color='black'; \" "
        var table_row = $("<div id="+id_row_name+" class='card col-4' "+zoomIn+" "+zoomOut+" style='width: 15rem;'  ></div>").text('');

        $("#image-card-body").append(table_row)




//        image_data = $("<img src='"+data.url+"' class='card-img-top' onmouseover=\"this.style.width='24rem';\" onmouseout=\"this.style.width='15rem';\"  >").text('');
        id_anchor_name = "card-image-".concat(row)
//        url_path = 'https://brazil-nestle-ndg.s3-sa-east-1.amazonaws.com/screenshots/Essenza/Casas_Bahia_28_03_2020.png'
//        url_path = 'https://brazil-nestle-ndg.s3-sa-east-1.amazonaws.com/screenshots/Essenza/Casas_Bahia_29_03_2020.png'
        image_anchor_data = $("<a id="+id_anchor_name+"  href='"+data.url+"' target='_blank' ></a>").text('');
//        image_anchor_data = $("<a id="+id_anchor_name+"  href='"+url_path+"' target='_blank' ></a>").text('');
        $("#"+id_row_name).append(image_anchor_data);


//        zoomIn = " onmouseover=\"this.style.width='24rem'; this.style.height='18rem';  \" "
//        zoomOut = " onmouseout=\"this.style.width='15rem'; this.style.height='12rem';  \" "

//        zoomIn = " onmouseover=\"this.style.background='#ff0000 ';   \" "
//        zoomOut = " onmouseout=\"this.style.background='';   \" "

        zoomIn = ""
        zoomOut = ""
//        url_path = 'https://brazil-nestle-ndg.s3-sa-east-1.amazonaws.com/screenshots/Essenza/Casas_Bahia_28_03_2020.png'
//        url_path = 'https://brazil-nestle-ndg.s3-sa-east-1.amazonaws.com/screenshots/Essenza/Casas_Bahia_29_03_2020.png'
//        image_data = $("<img src='"+url_path+"' class='card-img-top' "+zoomIn+" "+zoomOut+"  >").text('');
        image_data = $("<img src='"+data.url+"'  class='card-img-top' "+zoomIn+" "+zoomOut+"  >").text('');
        $("#"+id_anchor_name).append(image_data);


        id_card_name = "card-body-".concat(row)
        card_body = $("<div id="+id_card_name+" class='card-body'></div>").text('');
        $("#"+id_row_name).append(card_body);

        zoomIn = " onmouseover=\"this.style.color='#CCCCCC';   \" "
        zoomOut = " onmouseout=\"this.style.color='black';   \" "

        card_title = $("<h5 class='card-title text-center' "+zoomIn+" "+zoomOut+" ></h5>").text(data.loja);
        $("#"+id_card_name).append(card_title);

        card_title = $("<h5 class='card-title text-center' "+zoomIn+" "+zoomOut+" ></h5>").text(data.produto);
        $("#"+id_card_name).append(card_title);

        card_body = $("<div class='card-text  text-center font-italic text-nowrap'></div>").text(data.data);
        $("#"+id_card_name).append(card_body);





    })

}



function formatDate(d) {
    var date = new Date(d);

    if ( isNaN( date .getTime() ) ) {
        return d;
    }else{
        var month = new Array();
        month[0] = "Janeiro";
        month[1] = "Fevereiro";
        month[2] = "Março";
        month[3] = "Abril";
        month[4] = "Maio";
        month[5] = "Junho";
        month[6] = "Julho";
        month[7] = "Agosto";
        month[8] = "Setembro";
        month[9] = "Outubro";
        month[10] = "Novembro";
        month[11] = "Dezembro";

        day = date.getDate() + 1;
        if(day < 10){
            day = "0"+day;
        }
    return day + " de "+month[date.getMonth()]+ " de " + date.getFullYear();
    }
 }
