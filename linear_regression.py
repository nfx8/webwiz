""" 
simple linear regression
"""

import math


def linear_reg(d):
    """ regression based on a dataset """

    #shorthands   
    n = float(d.n())
    sumX = d.sumX()
    sumY = d.sumY()
    sumXY = d.sumXY()
    sumXX = d.sumXX()
    sumYY = d.sumYY()

    #slope
    b = (n * sumXY - (sumX * sumY)) / ( n * sumXX- sumX**2 )
    #intercept
    a = sumY/n - b * sumX/n

    sum_err =  n * sumYY - sumY**2 - b**2 * (n * sumXX - sumX**2)       
    sum_err *= 1 / ( n * (n-2))

    sum_b_err = n * sum_err / ( n * sumXX - sumX**2)
    sum_a_err = sum_b_err * d.sumXX() / n

    pearson_r = (n * sumXY - sumX * sumY) / ( math.sqrt( (n * sumXX - sumX**2 ) * (n * sumYY - sumY**2) ) )

    #TODO p-value

    return [a,b,pearson_r,sum_err]


class datapoint:

    def __init__(self,drow):
        self.x=drow[0]
        self.y=drow[1]

    def __str__(self):
        return 'x %5.3f y %5.3f'%(self.x,self.y)    

    def xy_product(self):
        return self.x * self.y        

    def x_squared(self):
        return self.x * self.x

    def y_squared(self):
        return self.y * self.y


class dataset:

    def __init__(self,datapoints):
        self.datapoints = datapoints

    def X(self):
        return [p.x for p in self.datapoints]

    def Y(self):
        return [p.y for p in self.datapoints]

    def sumXX(self):
        return sum([p.x_squared() for p in self.datapoints])

    def sumYY(self):
        return sum([p.y_squared() for p in self.datapoints])

    def sumXY(self):
        return sum([p.xy_product() for p in self.datapoints])

    def sumX(self):
        return sum(self.X())

    def sumY(self):
        return sum(self.Y())

    def descript(self):
        """ some desriptive statistics """
        print 'sumX: %5.3f  sumY: %5.3f   sumXY: %5.3f    sumXX: %5.3f   sum YY: %5.3f' \
        %(self.sumX(),self.sumY(),self.sumXY(),self.sumXX(),self.sumYY())

    def as_dict(self):
        """ as dict for JSON readability """
        d = list()
        for p in self.datapoints:
            d.append({'x':p.x,'y':p.y})
        return d

    def n(self):
        return len(self.datapoints)        


def sample_data_xy():
    dataset = sample_data()
    return dataset.as_dict()

def sample_data():
    data = []
    #mockup dataset from http://en.wikipedia.org/wiki/Simple_linear_regression
    with open('/static/simpledata.csv','r') as f:               
        for line in f.readlines():
            drow = [float(x) for x in line.split('|')]
            data.append(datapoint(drow))
    return dataset(data)


if __name__=='__main__':
    data = sample_data()
    data.descript()
    linear_reg(data)