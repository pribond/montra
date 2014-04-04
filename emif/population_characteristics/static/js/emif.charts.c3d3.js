/**********************************************************************
# Copyright (C) 2014 Luís A. Bastião Silva and Universidade de Aveiro
#
# Authors: Luís A. Bastião Silva <bastiao@ua.pt>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
***********************************************************************/

/* Auxliar functions to calculate minimum and max */ 

Array.max = function( array ){
    return Math.max.apply( Math, array );
};
 
Array.min = function( array ){
    return Math.min.apply( Math, array );
};


function GraphicChartC3D3(divArg, dataArg)
{
  /** Passes the initial arguments required to start and d3
  Also , this should be used to know if 
  */
  this.div = divArg; 
  this.dataValues = dataArg;
  this.xscale = null ;
  this.yscale = null ;
  this.legend = false;
  this.multivalue_comp = {}; 
  this.self = this;

  this.init = function(){
    // Just init the parameters, if it is really necessary.
  };

  this.translateData = function(objects){
    

    /*** Lets translate our data model to the d3 support data model */ 
    xscale = {'bins':5}
    xscale.bins = 25;
    var i = 1;
    legend = actualChart.legend;

    // This is a array of the pointers to the values 
    // For instance, to map the values F to array of values
    // M to the array of values, etc. 
    // This will increase the speed to access the data and also it is more easier.
    multivalue_comp = {};

    // values for the Y 
    datasetY = [actualChart.title['var']];
    // Values for the X axis
    datasetX = ['x'];
    // values for the Y - it can be an array with the values, 
    // because some values might be compared (for instance male and females)
    datasetYs = [];
    var i = 0;
    // Probably all of them are multivalue, maybe 
    if (actualChart.y_axis.multivalue)
      {

        // This will check if only a value is to be draw at the Y Bar
        if($.type(actualChart.y_axis['var']) === "string") {
            
            // It will look for all filters, because some filters on Y might have 
            // special treament, such as translation or multi value comparison 
            $.each(actualChart.filters, function(a){
              
              // Translate the fields (for now staticly hard coded for Gender)
              if (actualChart.filters[a]['name']=="Gender")
              {
                $.each(actualChart.filters[a]['translation'], function(tr) {
                    
                    // Only the simple ones will be translated. ALL is ignored by default 
                    if (tr!="ALL")
                    {

                      datasetYs.push([tr]);
                      multivalue_comp[tr] = datasetYs[datasetYs.length-1];
  
                    }
                    

                  });

              }
              

            });
            datasetX = ['x'];

          
        }
        else // If you need to draw several dimensions in the Y, like for instance, percentils (25, 50, 75 etc)
        {  // They will appear in the Y values. It is required to create the multiple datasets to support them
          // This lines works basically for initializers 
          actualChart.y_axis['var'].forEach(function(a){
          i = i +1;
          datasetYs.push([a]);
          });
          datasetX = ['x'];

        }
        
      }

    var _xValuesMV = {};
    objects.values.forEach(function(row){
      
      // Categorized means that the value of X is a string 
      // Y not a multi value - not sure if it happens sometime.
      if (actualChart.x_axis.categorized && !actualChart.y_axis.multivalue )
      {
       
        if ( row[actualChart.x_axis['var']] != ""){
          datasetX.push(row[actualChart.x_axis['var']]);  
          datasetY.push(parseFloat(row[actualChart.y_axis['var']]));  
        }
        
      }
      // Y has multiple values 
      else if (actualChart.y_axis.multivalue)
      {
        
        var k = 0;
        if (!_xValuesMV[row[actualChart.x_axis['var']]])
        {
          datasetX.push(row[actualChart.x_axis['var']]);  
          _xValuesMV[row[actualChart.x_axis['var']]] = true;
        }
        
        // Check if it is only a value, i.e a value in the Y axis
        if($.type(actualChart.y_axis['var']) === "string") {
           
            
            var _vv = parseFloat(row[actualChart.y_axis['var']]);
            _vv = +_vv || 0;

            multivalue_comp[row['Gender']].push(_vv);  


        } else { // More than a value. 
          actualChart.y_axis['var'].forEach(function(a){
          datasetYs[k].push(parseFloat(row[a.trim()]));  
          k = k +1 ;
          });
        }
          
      }
      else // Simple one 
      {
        datasetX.push(parseInt(row[actualChart.x_axis['var']]));
        datasetY.push(parseFloat(row[actualChart.y_axis['var']]));  
      }
      
      
    });
    
  };


  /***
  * 
  */
  this.draw = function(div, dataset){

    // Get the temporary var to get the chart title 
    var tmpValue = actualChart.title['var'];

    // Pre-set configurations to c3 
    chartConfigs = {
         padding: {
        left: 100,

    },
        bindto: '#pc_chart_place',
        data: {
          x : 'x',
          columns: [
          datasetX,
           datasetY,
          ],
          types: {
           // data1: 'bar',
          },
          
        },
        axis: {
          x: {
            //type: 'categorized',
            label_position : {},
            tick: { format: function (x) {
              if ($.type(x) === "string")  return x; 

            return parseInt(x);
            } 
          },

          },
          y: {
            label_position : {}
            
          }
        },
        zoom: {
          enabled: true,
        
        }
        
      };

    // By default, it is a var chart for this types.   
    chartConfigs.data.types[tmpValue] = 'bar';

    if (actualChart.x_axis.categorized && !actualChart.y_axis.multivalue)
    {
        var arr2 = datasetX.slice(0);
        arr2.shift();
        chartConfigs.axis.x.type = 'categorized';
        chartConfigs.axis.x.categories = arr2;

        chartConfigs.data.columns = [datasetY];  
        
        
        chartConfigs.data.xs = {};
        chartConfigs.data.x = {};
        
    }
    
    if (actualChart.y_axis.multivalue)
    {
      
      var arrX = datasetX.slice(0);
      var arrYs = datasetYs;

      arrYs.push(arrX);

      chartConfigs = {
         padding: {
        left: 100,

      },
      bindto: '#pc_chart_place',

        data: {
          x : 'x',
            
          columns: 
            datasetYs,          
        },
        axis: {
          x: {
            label_position : {},
            tick: { format: function (x) {

              if ($.type(x) === "string") { return x; }
              return parseInt(x);
            }
          },

          },
          y: {
            label_position : {}
            
          }
        },
        zoom: {
          enabled: true,
        
        }
        
      };
      if($.type(actualChart.y_axis['var']) === "string") {
        chartConfigs.data.types = {};

        chartConfigs.data.types['T'] = 'bar';
        if (actualChart.x_axis.categorized )
        {
            var arr2 = datasetX.slice(0);
            arr2.shift();
            chartConfigs.axis.x.type = 'categorized';
            chartConfigs.axis.x.categories = arr2;
            $.each(chartConfigs.data.columns, function(d){
                if (chartConfigs.data.columns[d][0]=="x"){
                  chartConfigs.data.columns[d] = ["x"];
                }
                
            });
            chartConfigs.data.xs = {};
            chartConfigs.data.x = {};

            
        }
        if (datasetYs.length==4)
        {
            if (datasetYs[0].length!=1 && datasetYs[1].length!=1 && datasetYs[2].length!=1)
            {
              chartConfigs.data.types['T'] = '';
              var arrY1 = datasetYs[0].slice(1);
              var arrY2 = datasetYs[1].slice(1);

              chartConfigs.axis.y['max'] = Math.max(Array.max(arrY1), Array.max(arrY2));
              chartConfigs.axis.y['min'] = 0;
            }
        }
        
        chartConfigs.data.types['M'] = 'bar';
        chartConfigs.data.types['F'] = 'bar';
        
        
        
        legend = true;
        //chartConfigs.data.x = {};
        chartConfigs.axis.x['tick'] = { format: function (x) {
             // console.log(x)
              if ($.type(x) === "string") {
                  return x;
              } 

            return parseInt(x);
            } };
         
      }
      
    }

    // Default configs
    chartConfigs.axis.x['label'] = {'text': actualChart.x_axis['label'], 'position': 'outer-center'};
    chartConfigs.axis.y['label'] = {'text': actualChart.y_axis['label'], 'position': 'outer-middle'};

    chartConfigs.axis.x['tick']['culling'] = true;
    chartConfigs.legend = {}
    chartConfigs.legend['show'] = legend;
    

    try{var chart = c3.generate(chartConfigs);}
    catch(ex)
    {
      // Handle the shit here!
      // Otherwise once you will be fucked up.
    }
   }; 
};





