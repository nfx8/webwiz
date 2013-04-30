#!/usr/bin/env python
# -*- coding: utf-8 -*-

# this is a flask python app
# the interactive graph is in the mainview.js which calls server side functions for calculations via AJAX
# this could be done on the client side, but the server side could introduce complex calculations

import os
import json
import random

from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask import request

# my simple statistics custom code
from linear_regression import *
from simplestat import *


#-- define app configs

app = Flask(__name__)
Bootstrap(app)
app.config['BOOTSTRAP_USE_CDN'] = True


#3 items
#rounte, caption internal_name
nav_bar = [
('/main/', 'main', 'graph'),
('/play/', 'play', 'play'),
('/about/', 'about', 'about')]

start_with_teaser = False

#--- main views
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """catch all paths here"""
    if path == "":
        if start_with_teaser:
            return render_template('start.html')
        else:
            return create_view('main')


    path_names = [x[0] for x in nav_bar]
    nav_dict = {path: (name,caption) for (path, name, caption) in nav_bar}

    #route to the main view
    path = '/' + path
    if path in nav_dict.keys():        
        name = nav_dict[path][0]
        return create_view(name)
    else:
        return 'path: %s not found paths' % (path,nav_names)

    

def create_view(viewname):
    """create standard view"""
    return render_template(viewname + '.html',navigation_bar=nav_bar,active_page=viewname)




#--- expose some statistic functions via AJAX
#this is the hard part, pushing data through from d3 to server side
#easy things could be done on the client instead (science.js is used for gaussian data)

@app.route('/data/')
def get_data():
    """ get data from server """
    return json.dumps(random_data(20))

@app.route('/sampledata/')
def get_sample_data():
    """ get data from server """
    rd = {'values':sample_data_xy()}
    return json.dumps(rd)

@app.route('/dist/',methods=['POST'])
def dist():
    """ get the distribution of values based on randomness faktor and number of points """
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])
        rd = {'values':    random_data(vals["beta"],vals["size"])}
        s = json.dumps(rd)
        return s 

@app.route('/distskew/',methods=['POST'])
def skewdist():
    """ a skewed distribution """
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])
        rd = {'values':    random_data_skew(vals["beta"])}
        s = json.dumps(rd)
        return s

@app.route('/stat/<statname>/',methods=['POST'])
def show_stat_name(statname):
    """ general statistic function """
    
    if request.method == 'POST':      
        # values come as JSON dicts    
        vals = json.loads(request.form['vals'])

        xvals = [z["x"] for z in vals]
        yvals = [z["y"] for z in vals]
        
        s = ""
        if statname=='regression':
            s = json.dumps(get_linear_reg(xvals,yvals))

        """
        #not used currently    
        elif statname=='median':
            s = json.dumps(get_median(xvals))

        elif statname=='average':
            s = json.dumps(get_avg(xvals))
        """
        
        return s  


if __name__ == '__main__':
    #run flask app with simple HTTP server. add your own server
    app.run(debug=False, port=8080, host='0.0.0.0')