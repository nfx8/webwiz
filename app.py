#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import json
import random

from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask import request

# my simple stat custom code
from linear_regression import *
from simplestat import *


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