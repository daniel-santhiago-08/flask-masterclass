$(function() {

    //AJAX INICIAL
    url = '/machines/hist-post'
    console.log(url)
    ajax_post_inicial(url)


    // LISTA DE FILTROS
    filters = []
    selects = $('#filters').find('select')
    console.log(selects)
    $.each(selects,function(key,filter) {
        filters.push(filter.id)
    });
    inputs = $('#filters').find('input')
    $.each(inputs,function(key,filter) {
        filters.push(filter.id)
    });


    // FILTROS
    $.each(filters,function(key,filter) {
        $("#"+filter).on('change', function(event) {
            filter_values = get_filter_values(filters)
            ajax_post(url,page,filter_values,order_by_field,order_by_order)
        event.preventDefault();
        })
    });


    // PAGINACAO
    $('.pagination button').on('click',function(event){
        id = $(this).attr("id");
        page = get_page(id, page)
        console.log(page)
        filter_values = get_filter_values(filters)
        ajax_post(url,page,filter_values,order_by_field,order_by_order)
        event.preventDefault();
    });


    // ORDENAÇÃO
//    $('.thead').on('click', 'i.fa' ,function() {
    $('.thead').on('click', 'i.material-icons' ,function() {


        $(".thead").find("i").css('color', 'black');

        field_asc = $(this).attr("id").split('-')[0]
        order_by_field = field_asc
        if (order_by_order == 'asc'){
            order_by_order = 'desc';
        }else if (order_by_order == 'desc'){
            order_by_order = 'asc';
        }
        console.log(filters)
        filter_values = get_filter_values(filters)
        ajax_post(url,page,filter_values,order_by_field,order_by_order)
        event.preventDefault();
    });



});



function CreateFilters(filter_dict){


    // CRIAR LABELS DE FILTRO e VALORES INICIAIS
//    $.each(filter_dict, function(key, filter){
//
//        label_input = '<label class="input-group-text" style="text-transform:capitalize;" for="'+filter['filter_name']+'"></label></div>'
//        full_label = $(label_input).text(filter['field_name'])
//        $("#filters").append(full_label);
//        if (filter['filter_type'] == 'select'){
//            sel = '<select id="'+filter['filter_name']+'" class="mr-2 form-control selectpicker">'
//            opt = '<option value="%">Todos</option>'
//            close = '</select>'
//            select_elem = sel+opt+close
//            $("#filters").append(select_elem);
//
//        }else if(filter['filter_type'] == 'date'){
//            inp1 = '<input type="date" id="'+filter['filter_name']+'" '
//            inp2 = ' class="mr-2 form-control" style="width: 150px;">'
//            inp = inp1 + inp2
//            $("#filters").append(inp);
//        }
//    })




    $.each(filter_dict, function(key, filter){
        if (filter['filter_type'] == 'select'){
            $.each(filter['filter_initial_value'], function (key, data) {
                option_tag = "<option value='"+data+"'>"+data+"</option>"
                $('#'+filter['filter_name']).append(option_tag)
            })
        }else if (filter['filter_type'] == 'date'){
            $('#'+filter['filter_name']).attr('value', filter['filter_initial_value']);
        }
    })




}


function CreateTable(query_result, fields_list,
    order_by_field, order_by_order){

    $("#table_body_ajax").empty();
    $("#table-header-ajax").empty();

    // ICONE DE ORDENAÇÃO
    if (order_by_order == 'desc'){
//        icon_class = 'fa fa-chevron-up ml-2'
        icon_class = 'arrow_drop_up'
    }else{
//        icon_class = 'fa fa-chevron-down ml-2'
        icon_class = 'arrow_drop_down'
    }


    //TABLE HEADER
    table_row = $("<tr></tr>").text('')
    $("#table-header-ajax").append(table_row);
    $.each(fields_list, function (column, data) {
        var th_id = "header-".concat(data);
        var th_style = "'white-space: nowrap; font-size:20px; font-weight:bold; text-transform:capitalize;'"
        var th_tag = "<th id="+th_id+" style="+th_style+" class='th-description'></th>";
        if (data == order_by_field){
//            var i_tag = "<i class='"+icon_class+"' style='color: #27A2FC;' id='"+data+"-order'></i>"
            var i_tag = "<i class='material-icons' style='color: #27A2FC;' id='"+data+"-order'></i>"
        }else{
//            var i_tag = "<i class='fa fa-chevron-down ml-2' id='"+data+"-order'></i>"
            var i_tag = "<i class='material-icons' id='"+data+"-order'></i>"
        }

        var table_head_row = $(th_tag).text(data);
//        var table_head_row_head = $(i_tag).text('');
//        var table_head_row_head = $(i_tag).text('arrow_drop_down');

        if (data == order_by_field){
            var table_head_row_head = $(i_tag).text(icon_class);
        }else{
            var table_head_row_head = $(i_tag).text('arrow_drop_down');
        }


        $("#table-header-ajax tr").append(table_head_row);
        var th_id = "header-".concat(data);
        $("#"+th_id).append(table_head_row_head)
    })


    //TABLE BODY
    $.each(query_result, function (row, data) {
        id_row_name = "table-row-".concat(row)
        bg = "this.style.background='lightgray';"
        mouse_over = "this.bgColor='white'"
        var table_row = $("<tr id="+id_row_name+" onmouseover=\"this.style.background='lightgray';\"  onmouseout=\"this.style.background='';\" ></td>").text('');
        $("#table_body_ajax").append(table_row)

        $.each(data, function (column, data) {
                var table_data;
                table_data = $("<td ></td>").text(data);
                $("#"+id_row_name).append(table_data);
        })
    })
}


function CreatePagination(page, pages, has_prev, has_next){


    $("#current-page").empty();

    page_text = 'Página '+page+' de '+pages
    $("#current-page").append(page_text)

    if (has_prev == true){
        $("#previous-page").show()
    }else{
        $("#previous-page").hide()
    }
    if (has_next == true){
        $("#next-page").show()
    }else{
        $("#next-page").hide()
    }

}


function get_filter_values(filters){

    json_filters = {}
    $.each(filters,function(key,filter) {
        json_filters[filter] = $("#"+filter).val()
    })
    filter_values = JSON.stringify(json_filters)

    return filter_values
}


function get_page(id, page){


    if (id == 'next-page'){
        go_page = parseInt(page) + 1
        if (go_page >= pages){
            go_page = pages
        }
    }else if (id == 'previous-page') {
        go_page = parseInt(page) - 1
        if (go_page <= 1){
            go_page = '1'
        }
    }


    return go_page
}

function ajax_post_inicial(url){

    $.ajax({
//        data : {
//            page : 1
//        },
        type : 'POST',
        url : url,
        success: function(result){

        query_result = result['query_result']
        fields_list = result['fields_list']
        order_by_field = result['order_by_field']
        order_by_order = result['order_by_order']
        page = result['page'].toString()
        pages = result['pages'].toString()
        has_prev = result['has_prev']
        has_next = result['has_next']
        filter_dict = result['filter_dict']


        CreateFilters(filter_dict)
        CreateTable(query_result, fields_list,
            order_by_field, order_by_order)
        CreatePagination(page, pages, has_prev, has_next)

        }

    });

}


function ajax_post(url,page,filter_values,order_by_field,order_by_order){


    console.log(filter_values)

    $.ajax({
        data : {
            page : page,
            filter_values: filter_values,
            order_by_field: order_by_field,
            order_by_order: order_by_order
        },
        type : 'POST',
        url : url,

        success: function(result){

        query_result = result['query_result']
        fields_list = result['fields_list']
        order_by_field = result['order_by_field']
        order_by_order = result['order_by_order']
        page = result['page'].toString()
        pages = result['pages'].toString()
        has_prev = result['has_prev']
        has_next = result['has_next']

        CreateTable(query_result, fields_list,
            order_by_field, order_by_order)
        CreatePagination(page, pages, has_prev, has_next)

        }
    });


}