$(function() {


    //AJAX INICIAL
    console.log('INICIO')
    url = '/machines/hist-post'

    $.ajax({
        data : {
            page : 1
//            select_produto: '%',
//            select_loja: '%'

        },
        type : 'POST',
        url : url,
        success: function(result){
        console.log(result);

        query_result = result['query_result']
        fields_list = result['fields_list']
        order_by = result['order_by']
        page = result['page'].toString()
        pages = result['pages'].toString()
        has_prev = result['has_prev']
        has_next = result['has_next']
        select_produto = result['select_produto']
        select_loja = result['select_loja']
        date_data_extracao_start = result['date_data_extracao_start']
        date_data_extracao_end = result['date_data_extracao_end']




        CreateFilters(select_produto,select_loja,
            date_data_extracao_start,
            date_data_extracao_end)
        CreateTable(query_result,fields_list, order_by)
        CreatePagination(page, pages, has_prev, has_next)

        }

    });

    filters = []
    selects = $('#filters').find('select')
    $.each(selects,function(key,filter) {
        filters.push(filter.id)
    });

    inputs = $('#filters').find('input')
    $.each(inputs,function(key,filter) {
        filters.push(filter.id)
    });

    console.log(filters)

    // FILTROS
    $.each(filters,function(key,filter) {
        $("#"+filter).on('change', function(event) {
            json_filters = {}
            $.each(filters,function(key,filter) {
                json_filters[filter] = $("#"+filter).val()
            })

            console.log(json_filters)
            $.ajax({
            data : {
                page : page,
                filter_values: JSON.stringify(json_filters)
            },
            type : 'POST',
            url : url,

            success: function(result){

            console.log(result);

            query_result = result['query_result']
            fields_list = result['fields_list']
            order_by = result['order_by']
            page = result['page'].toString()
            pages = result['pages'].toString()
            has_prev = result['has_prev']
            has_next = result['has_next']

            CreateTable(query_result, fields_list, order_by)
            CreatePagination(page, pages, has_prev, has_next)
            }
        });
        event.preventDefault();
        })
    });




//    // FILTRO SELECT PRODUTO
//    $('#select_produto').on('change',function(event){
//
//        change = $(this).val();
//        $.ajax({
//            data : {
//                page : page,
//                select_produto: change,
//                select_loja: select_loja,
//                date_data_extracao_start: date_data_extracao_start,
//                date_data_extracao_end: date_data_extracao_end
//            },
//            type : 'POST',
//            url : url,
//
//            success: function(result){
//
//            console.log(result);
//
//            query_result = result['query_result']
//            fields_list = result['fields_list']
//            order_by = result['order_by']
//            page = result['page'].toString()
//            pages = result['pages'].toString()
//            has_prev = result['has_prev']
//            has_next = result['has_next']
//
//            CreateTable(query_result, fields_list, order_by)
//            CreatePagination(page, pages, has_prev, has_next)
//
//            }
//
//        });
//
//        event.preventDefault();
//
//
//    });
//
//
//    // FILTRO SELECT LOJA
//    $('#select_loja').on('change',function(event){
//
//        change = $(this).val();
//        $.ajax({
//            data : {
//                page : page,
//                select_produto: select_produto,
//                select_loja: change,
//                date_data_extracao_start: date_data_extracao_start,
//                date_data_extracao_end: date_data_extracao_end
//
//            },
//            type : 'POST',
//            url : url,
//
//            success: function(result){
//
//            console.log(result);
//
//            query_result = result['query_result']
//            fields_list = result['fields_list']
//            order_by = result['order_by']
//            page = result['page'].toString()
//            pages = result['pages'].toString()
//            has_prev = result['has_prev']
//            has_next = result['has_next']
//
//            CreateTable(query_result, fields_list, order_by)
//            CreatePagination(page, pages, has_prev, has_next)
//
//            }
//
//        });
//
//        event.preventDefault();
//
//
//    });
//
//    // FILTRO DATA
//    $('#date_data_extracao_start').on('change',function(event){
//
//        change = $(this).val();
//        $.ajax({
//            data : {
//                page : page,
//                select_produto: select_produto,
//                select_loja: select_loja,
//                date_data_extracao_start: change,
//                date_data_extracao_end: date_data_extracao_end
//            },
//            type : 'POST',
//            url : url,
//
//            success: function(result){
//
//            console.log(result);
//
//            query_result = result['query_result']
//            fields_list = result['fields_list']
//            order_by = result['order_by']
//            page = result['page'].toString()
//            pages = result['pages'].toString()
//            has_prev = result['has_prev']
//            has_next = result['has_next']
//
//            CreateTable(query_result, fields_list, order_by)
//            CreatePagination(page, pages, has_prev, has_next)
//
//            }
//
//        });
//
//        event.preventDefault();
//
//
//    });



    // PAGINACAO
    $('.pagination button').on('click',function(event){

        id = $(this).attr("id");
        console.log(id)
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

        $.ajax({
            data : {
                page : go_page,
                select_produto: select_produto,
                select_loja: select_loja

            },
            type : 'POST',
            url : url,

            success: function(result){

            console.log(result);

            query_result = result['query_result']
            fields_list = result['fields_list']
            order_by = result['order_by']
            page = result['page'].toString()
            pages = result['pages'].toString()
            has_prev = result['has_prev']
            has_next = result['has_next']

            CreateTable(query_result, fields_list, order_by)
            CreatePagination(page, pages, has_prev, has_next)

            }

        });

        event.preventDefault();

    });



});


function CreateFilters(
    select_produto,select_loja,min_date,max_date){

    $.each(select_produto, function (column, data) {
        option_tag = "<option value='"+data+"'>"+data+"</option>"
        $('#select_produto').append(option_tag)
    })

    $.each(select_loja, function (column, data) {
        option_tag = "<option value='"+data+"'>"+data+"</option>"
        $('#select_loja').append(option_tag)
    })

    $('#date_data_extracao_start').attr('value', min_date);
    $('#date_data_extracao_end').attr('value', max_date);


}


function CreateTable(query_result, fields_list, order_by){

    $("#table_body_ajax").empty();
    $("#table-header-ajax").empty();


    order_by_column = order_by.replace('-','');
    if (order_by.search('-')){
        icon_class = 'fa fa-chevron-up ml-2'
    }else{
        icon_class = 'fa fa-chevron-down ml-2'
    }

    //TABLE HEADER
    table_row = $("<tr></tr>").text('')
    $("#table-header-ajax").append(table_row);
    $.each(fields_list, function (column, data) {
        var th_id = "header-".concat(data);
        var th_style = "'white-space: nowrap; text-transform:capitalize;'"
        var th_tag = "<th id="+th_id+" style="+th_style+"></th>";
        if (data == order_by_column){
            var i_tag = "<i class='"+icon_class+"' style='color: #27A2FC;' id='"+data+"-order'></i>"
        }else{
            var i_tag = "<i class='fa fa-chevron-down ml-2' id='"+data+"-order'></i>"
        }

        var table_head_row = $(th_tag).text(data);
        var table_head_row_head = $(i_tag).text('');

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
                table_data = $("<td></td>").text(data);
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