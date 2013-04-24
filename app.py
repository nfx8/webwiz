#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask import request
import json
import random

from linear_regression import *

app = Flask(__name__)
Bootstrap(app)
app.config['BOOTSTRAP_USE_CDN'] = True

nav_bar = [
('/main/', 'main', 'main'),
('/about/', 'about', 'about')]


@app.route('/')
def start():
    return render_template('start.html')

@app.route('/main/')
def demo():
    return render_template('main.html',navigation_bar=nav_bar,active_page="main")

@app.route('/about/')
def about():
    return render_template('about.html',navigation_bar=nav_bar,active_page="about")




#expose some statistic functions via AJAX
#this is the hard part, pushing data through from d3 to server side

def get_linear_reg(x,y):    

    datalist = []
    for i in range(len(x)):
        datalist.append(datapoint([x[i],y[i]]))

    data = dataset(datalist)

    [a,b,pearson_r,sum_err] =  linear_reg(data)


    result = dict()
    result['slope'] = round(b,3)
    result['intercept'] = round(a,3)
    result['r_value'] = round(pearson_r,3)
    result['p_value'] = -1.0
    result['std_err'] = round(sum_err,3)

    return result


def get_avg(vals):  
    sumv = sum(vals)
    n = float(len(vals)) 
    return round(sumv/n,3)    


def get_median(vals):
    n = len(vals)
    midpoint = int(round(n/2,0))
    return round(vals[midpoint],3)    



def random_data(factor,size):
    #data = sample_data()
    data = list()
    a = 3
    b = 10
    for i in range(size):
        d = {'x':i+a, 'y': i+b + random.random()*factor} 
        data.append(d)

    #s = json.dumps(data)
    return data



@app.route('/data/')
def get_data():
    return json.dumps(random_data(20))
    #return json.dumps({'values':get_groesse_KA()})

@app.route('/dist/',methods=['POST'])
def dist():
    
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])
        rd = {'values':    random_data(vals["beta"],vals["size"])}
        s = json.dumps(rd)
        return s 

@app.route('/stat/<statname>/',methods=['POST'])
def show_stat_name(statname):
    
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])

        xvals = [z["x"] for z in vals]

        yvals = [z["y"] for z in vals]

        #print xvals,yvals

        
        s = ""
        if statname=='median':
            s = json.dumps(get_median(xvals))

        elif statname=='average':
            s = json.dumps(get_avg(xvals))

        elif statname=='regression':
            s = json.dumps(get_linear_reg(xvals,yvals))

        
        return s  

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')