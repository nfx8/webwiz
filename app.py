#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import random

from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask import request

# my simple regression (custom code)
from linear_regression import *


#-- define app configs
app = Flask(__name__)
Bootstrap(app)
app.config['BOOTSTRAP_USE_CDN'] = True

nav_bar = [
('/main/', 'main', 'main'),
('/about/', 'about', 'about')]


#--- main views

@app.route('/')
def start():
    return render_template('start.html')

@app.route('/main/')
def demo():
    return render_template('main.html',navigation_bar=nav_bar,active_page="main")

@app.route('/about/')
def about():
    return render_template('about.html',navigation_bar=nav_bar,active_page="about")




#--- server side functions

def get_linear_reg(x,y):    

    #prepare data
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
    result['avgx'] = int(get_avg(x))
    result['avgy'] = int(get_avg(y))


    return result

def get_avg(vals):  
    sumv = sum(vals)
    n = float(len(vals)) 
    return round(sumv/n,3)

def get_median(vals):
    n = len(vals)
    midpoint = int(round(n/2,0)) # when length is odd always choose the upper element
    return round(vals[midpoint],3)    


def random_data(factor,size):
    """ some random data along a line """
    data = list()
    a = 3
    b = 10
    for i in range(size):
        d = {'x':i+a, 'y': i+b + random.random()*factor} 
        data.append(d)

    return data


def random_data_skew(factor):
    """ some random data along a line """
    data = list()
    a = 3
    b = 10
    size = 20
    for i in range(size):
        d = {'x':i+a, 'y': i+b + random.random()*factor} 
        data.append(d)

    data.append({'x':5, 'y': 22})
    data.append({'x':6, 'y': 23})
    data.append({'x':7, 'y': 21})
    data.append({'x':8, 'y': 25})

    data.append({'x':20, 'y': 17})
    data.append({'x':21, 'y': 18})
    data.append({'x':22, 'y': 16})
    data.append({'x':23, 'y': 19})
    return data


#--- expose some statistic functions via AJAX
#this is the hard part, pushing data through from d3 to server side
#easy things could be done on the client instead (using science.js for example)

@app.route('/data/')
def get_data():
    """ get data from server """
    return json.dumps(random_data(20))


@app.route('/dist/',methods=['POST'])
def dist():
    
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])
        rd = {'values':    random_data(vals["beta"],vals["size"])}
        s = json.dumps(rd)
        return s 

@app.route('/distskew/',methods=['POST'])
def skewdist():
    
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])
        rd = {'values':    random_data_skew(vals["beta"])}
        s = json.dumps(rd)
        return s 

@app.route('/stat/<statname>/',methods=['POST'])
def show_stat_name(statname):
    """ general statistic function """
    
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])

        xvals = [z["x"] for z in vals]

        yvals = [z["y"] for z in vals]
        
        s = ""
        if statname=='median':
            s = json.dumps(get_median(xvals))

        elif statname=='average':
            s = json.dumps(get_avg(xvals))

        elif statname=='regression':
            s = json.dumps(get_linear_reg(xvals,yvals))

        
        return s  


if __name__ == '__main__':
    #run flask app with simple HTTP server. add your own server
    app.run(debug=False, port=8080, host='0.0.0.0')