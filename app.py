#!/usr/bin/env python
# -*- coding: utf-8 -*-
import os
from flask import Flask, render_template
from flask.ext.bootstrap import Bootstrap
from flask import request
import json
import numpy as np
from scipy import stats


app = Flask(__name__)
Bootstrap(app)
app.config['BOOTSTRAP_USE_CDN'] = True

nav_bar = [
('/magic/', 'magic', 'magic'),
('/about/', 'about', 'about')]


@app.route('/')
def start():
    return render_template('start.html')

@app.route('/magic/')
def demo():
    return render_template('main.html',navigation_bar=nav_bar,active_page="magic")

@app.route('/about/')
def about():
    return render_template('about.html',navigation_bar=nav_bar,active_page="about")




#expose some statistic functions via AJAX
#this is the hard part, pushing data through from d3 to server side

def linear_reg(x,y):    

    print x
    print y
    slope, intercept, r_value, p_value, std_err = stats.linregress(x,y)

    result = dict()
    result['slope'] = round(slope,3)
    result['intercept'] = round(intercept,3)
    result['r_value'] = round(r_value,3)
    result['p_value'] = round(p_value,3)
    result['std_err'] = round(std_err,3)

    return result


def get_avg(vals):   
    return round(np.mean(vals),2)    


def get_median(vals):
    return round(np.median(vals),2)    


@app.route('/stat/<statname>/',methods=['POST'])
def show_stat_name(statname):
    
    if request.method == 'POST':          
        vals = json.loads(request.form['vals'])

        xvals = [z["cx"] for z in vals]

        yvals = [z["cy"] for z in vals]

        print xvals,yvals

        
        s = ""
        if statname=='median':
            s = json.dumps(get_median(xvals))

        elif statname=='average':
            s = json.dumps(get_avg(xvals))

        elif statname=='regression':
            s = json.dumps(linear_reg(xvals,yvals))

        
        return s  

if __name__ == '__main__':
    app.run(debug=True, port=8080, host='0.0.0.0')
