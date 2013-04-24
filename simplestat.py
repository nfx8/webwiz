import random

from linear_regression import *

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
