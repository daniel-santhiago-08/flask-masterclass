from . import machines

from flask import jsonify, render_template, request
from flask_login import login_required
from app.models import t_price_crawler_evolution, t_price_crawler_hist
from app import db
import math
import json
from datetime import date
from sqlalchemy.sql import and_, or_

# @machines.route('/machines/hist/<int:page_number>', methods=['GET'])
@machines.route('/machines/hist', methods=['GET', 'POST'])
@login_required
# def hist(page_number=1):
def hist():

    return render_template('machines/hist.html')


@machines.route('/machines/hist-post', methods=['POST'])
@login_required
def post_hist():

    # ******** INICIALIZAÇÃO ******** #
    table_name = t_price_crawler_hist
    per_page = 5 # NÚMERO DE REGISTROS POR PÁGINA
    page = 1 # PÁGINA INICIAL
    order_by_field = 'id' # COLUNA QUE FARÁ A ORDENAÇÃO INICIAL DA TABELA
    order_by_order = 'desc' # 'asc' - CRESCENTE ou 'desc' - DECRESCENTE
    filter_dict = [
        {'field_name': 'produto',
         'filter_type': 'select',
         'filter_name': 'select_produto',
        },
        {'field_name': 'loja',
         'filter_type': 'select',
         'filter_name': 'select_loja',
        },
        {'field_name': 'data_extracao',
         'filter_type': 'date',
         'filter_name': 'date_data_extracao_start',
        },
        {'field_name': 'data_extracao',
         'filter_type': 'date',
         'filter_name': 'date_data_extracao_end',
        }
    ]


    # ******** POST DATA ******** #


    if request.form.get('page'):
        page = request.form['page']

    if request.form.get('order_by_field'):
        order_by_field = request.form['order_by_field']
    if request.form.get('order_by_order'):
        order_by_order = request.form['order_by_order']


    if not request.form.get('filter_values'): # VALORES INICIAIS
        for filter in filter_dict:
            get_field_name = getattr(table_name.columns, filter['field_name'])
            if filter['filter_type'] == 'select':
                all_options = db.session.query(get_field_name).all()
                option_set = [option[0] for option in all_options]
                select_option = list(set(option_set))
                filter.update({'filter_initial_value': select_option})
                filter.update({'filter_value': '%'})
            if filter['filter_type'] == 'date':
                if filter['filter_name'].endswith('start'):
                    date = db.session.query(db.func.min(get_field_name)).first() # PRIMEIRA DATA
                elif filter['filter_name'].endswith('end'):
                    date = db.session.query(db.func.max(get_field_name)).first() # ÚLTIMA DATA
                date_format = date[0].strftime("%Y-%m-%d")
                filter.update({'filter_initial_value': date_format})
                filter.update({'filter_value': date_format})

    else: # VALORES RESULTANTES DOS FILTROS
        filters = request.form.get('filter_values')
        print(filters)
        filters_json = json.loads(filters)
        for filter in filter_dict:
            filter.update({'filter_value': filters_json[filter['filter_name']]})



    # ******** FILTROS ******** #

    filters_list = []
    for filter in filter_dict:
        get_field_name = getattr(table_name.columns, filter['field_name'])
        if filter['filter_type'] == 'select':
            get_filter_value = get_field_name.like(filter['filter_value'])
        if filter['filter_name'].endswith('start'):
            get_filter_value = get_field_name >= (filter['filter_value'])
        if filter['filter_name'].endswith('end'):
            get_filter_value = get_field_name <= (filter['filter_value'])
        filters_list.append(get_filter_value)


    # ******** QUERIES ******** #


    get_order_field = getattr(table_name.columns, order_by_field)
    order_field = getattr(get_order_field, order_by_order)()


    query_result = db.session.query(table_name) \
        .filter(and_(*filters_list)) \
        .order_by(order_field) \
        .all()


    columns_description = db.session.query(table_name).column_descriptions





    # ******** PAGINAÇÃO ******** #
    registers = len(query_result)
    pages = math.ceil(registers / per_page)
    range_start = (int(page) - 1) * per_page
    range_end = range_start + per_page
    if str(page) == '1':
        has_prev = False
    else:
        has_prev = True

    if str(page) == str(pages):
        has_next = False
    else:
        has_next = True

    # ******** RESPONSE ******** #

    query_result = query_result[range_start:range_end]
    colunas = [column['name'] for column in columns_description]


    # print(filter_dict)

    if request.method == "POST":
        return jsonify({'query_result':query_result,
                        'fields_list':colunas,
                        'order_by_field':order_by_field,
                        'order_by_order':order_by_order,
                        'page': page,
                        'pages': pages,
                        'has_prev': has_prev,
                        'has_next': has_next,
                        'filter_dict': filter_dict
                        })

    return jsonify({'error': 'MissingData'})





@machines.route('/evolution', methods=['GET', 'POST'])
@login_required
def evolution(page_number=1):
    machines = db.session.query(t_price_crawler_evolution).all()

    columns_description = db.session.query(t_price_crawler_evolution).column_descriptions
    colunas = [column['name'] for column in columns_description]

    # db_session.query(Notice).filter(getattr(Notice, col_name).like("%" + query + "%"))




    return render_template('machines/evolution.html', machines=machines,
                           colunas=colunas, page_number=page_number)