from . import machines

from flask import jsonify, render_template, request
from flask_login import login_required
from app.models import t_price_crawler_evolution, t_price_crawler_hist
from app import db
import math
import json
from datetime import date

# @machines.route('/machines/hist/<int:page_number>', methods=['GET'])
@machines.route('/machines/hist', methods=['GET', 'POST'])
@login_required
# def hist(page_number=1):
def hist():

    machines = db.session.query(t_price_crawler_hist).all()[0:1]
    # machines = db.session.query(t_price_crawler_hist).paginate(page=page_number, per_page=4)



    # for m in machines.items:
    #     print(m.id)

    columns_description = db.session.query(t_price_crawler_hist).column_descriptions
    colunas = [column['name'] for column in columns_description]

    # db_session.query(Notice).filter(getattr(Notice, col_name).like("%" + query + "%"))
    page_number = 1

    return render_template('machines/hist.html', machines=machines, colunas=colunas,
                       page_number=page_number)


@machines.route('/machines/hist-post', methods=['POST'])
@login_required
def post_hist():

    # ******** INICIALIZAÇÃO ******** #
    table_name = t_price_crawler_hist
    per_page = 5
    order_by = 'id'
    min_date = db.session.query(db.func.min(table_name.columns.data_extracao)).first()
    max_date = db.session.query(db.func.max(table_name.columns.data_extracao)).first()

    date_data_extracao_start = min_date[0].strftime("%Y-%m-%d")
    date_data_extracao_end = max_date[0].strftime("%Y-%m-%d")

    # ******** POST DATA ******** #

    if not request.form.get('filter_values'):
        select_produto = '%'
        select_loja = '%'
    else:
        filters = request.form.get('filter_values')
        filers_json = json.loads(filters)
        select_produto = filers_json['select_produto']
        select_loja = filers_json['select_loja']
        date_data_extracao_start = filers_json['date_data_extracao_start']
        date_data_extracao_end = filers_json['date_data_extracao_end']


    # print(request.form.filter_values)
    #
    # print(request.form.filter_values.select_produto)




    page = request.form['page']
    # if not request.form.get('select_produto'):
    #     select_produto = '%'
    #     print('not found')
    # else:
    #     select_produto = request.form['select_produto']
    #
    # if not request.form.get('select_loja'):
    #     select_loja = '%'
    #     print('not found')
    # else:
    #     select_loja = request.form['select_loja']
    #
    #
    # if request.form.get('date_data_extracao_start'):
    #     date_data_extracao_start = request.form['date_data_extracao_start']
    #
    # if request.form.get('date_data_extracao_end'):
    #     date_data_extracao_end = request.form['date_data_extracao_end']



    # ******** QUERIES ******** #

    # query_result = db.session.query(table_name).all()

    # query_result = db.session.query(table_name) \
    #     .filter(table_name.columns.produto.like(select_produto)) \
    #     .filter(table_name.columns.loja.like(select_loja)) \
    #     .all()

    # start = date(year=2020, month=4, day=20)

    query_result = db.session.query(table_name) \
        .filter(table_name.columns.produto.like(select_produto)) \
        .filter(table_name.columns.loja.like(select_loja)) \
        .filter(table_name.columns.data_extracao >= date_data_extracao_start) \
        .filter(table_name.columns.data_extracao <= date_data_extracao_end) \
        .all()

    columns_description = db.session.query(table_name).column_descriptions


    '''
    ### NÃO APAGAR ##
    
    REFERENCIA
    
    query = meta.Session.query(User).filter(User.firstname.like(searchVar1)). \
                                 filter(User.lastname.like(searchVar2))
                                 
     FILTRAR  LIKE COMO '%' PARA RETORNAR TODOS OS VALORES
                                 
    
    '''



    # ******** FILTROS ******** #
    produtos = db.session.query(table_name.columns.produto).all()
    produto_set = [produto[0] for produto in produtos]
    select_produto = list(set(produto_set))

    lojas = db.session.query(table_name.columns.loja).all()
    loja_set = [loja[0] for loja in lojas]
    select_loja = list(set(loja_set))


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


    if request.method == "POST":
        return jsonify({'query_result':query_result,
                        'fields_list':colunas,
                        'order_by':order_by,
                        'page': page,
                        'pages': pages,
                        'has_prev': has_prev,
                        'has_next': has_next,
                        'select_produto': select_produto,
                        'select_loja': select_loja,
                        'date_data_extracao_start': date_data_extracao_start,
                        'date_data_extracao_end': date_data_extracao_end
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