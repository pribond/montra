/**********************************************************************
# Copyright (C) 2013 Luís A. Bastião Silva and Universidade de Aveiro
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


/********************************************************
**************** Population Characteristics API 
*********************************************************/


function getFingerprintID(){
  var url = document.URL;
  var fingerprint_id='abcd';
  try{
    fingerprint_id = url.split("population/new/")[1].split("/1")[0];
  }
  catch(err){
    fingerprint_id='abcd'
  };
  return fingerprint_id;

};


function PCAPI () 
{
    this.getGender = function(){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Active patients/Gender/abcd",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getName1 = function(){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Active patients/Name1/abcd",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getName2 = function(){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Active patients/Name2/abcd",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };


    this.getValue1 = function(){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Active patients/Value1/abcd",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };


    this.getValue2 = function(){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Active patients/Name2/abcd",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getNameN = function(nameN){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/" + nameN,
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getValueN = function(valueN){
          var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/" + valueN,
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getVar = function(){
        var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Var",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getChart = function(){
        var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/Var",
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };
    this.getValuesRow = function(Var, Row, fingerprintID){
        var result = {}
          
        $.ajax({
          dataType: "json",
          url: "population/jerboalistvalues/"+Var+"/"+Row+"/" + fingerprintID,
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

    this.getFilter = function(Var, Row, fingerprintID){
        var result = {}
        fingerprintID = 'abcd';  
        $.ajax({
          dataType: "json",
          url: "population/filters/"+Var+"/" + fingerprintID,
          async: false,
          data: result,
          success: function (data){result=data;},
        });
        return result;
    };

};

/********************************************************************
**************** Population Characteristics - Bar (Jquery Plugin) 
*********************************************************************/


 (function( $ )
 {

    var methods = {
        init : function( options, name, fingerprintId ) {

            
            /** Get a list of filters */
            values = options.getFilter(name.text,fingerprintId);
            console.log("parsing:");
            console.log(JSON.parse(values.values));
            if (values===undefined)
            {
                return;
            };

            console.log(values);
            var self = this;
            self.html('');
            self.append("Gender: ");
            var tmpUl = $('<ul class="nav nav-pills nav-stacked">');

            self.append(tmpUl);
            $.each(values.values, function (data){
                if (values.values[data]==="")
                    return;
                tmpUl.append('<li><a class="filterBar" href="#" onclick="return false;"><i id="iproximity" class="icon-ok icon-black active"></i> '+values.values[data]+'</a></li>')
            });
            
            
            
            $(".filterBar").bind('click',function(e)
                    { 
                      e.preventDefault(); 
                      e.stopPropagation();
                      
                      
                      if ($(e.toElement.firstChild).hasClass('icon-ok')) 
                      {
                        $(e.toElement.firstChild).removeClass('icon-ok') 
                      }
                      else
                      {
                        $(e.toElement.firstChild).addClass('icon-ok') 
                      }
                      return false;
                    });

            var match=false;

        },
        draw : function( options ) {
            
        },

    };

    $.fn.populationChartsBar = function(method) {
        // Method calling logic
        if ( methods[method] ) {
        return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
        } else {
        $.error( 'Method ' + method + ' does not exist on jQuery.populationCharts' );
        }
        return this;
    };
}( jQuery ));


/********************************************************************
**************** Population Characteristics Types
*********************************************************************/

 (function( $ )
 {

    var PC = null;
    function Filters()
    {
      this.drawFilters = function(){
      };
      this.bindFilters = function(){
            $(".graphTypes").bind('click',function(e)
                    { 
                      e.preventDefault(); 
                      e.stopPropagation();
                      console.log(this.parent);
                      
                      // Anyone have a better suggestion to do it?
                      // I'm more focuses in other staff right now.
                      // Bastiao, 2014.Feb.09
                      $('.graphTypes').closest('li').removeClass('active')
                      $(this.parentNode).closest('li').addClass('active')

                      PC = new PCAPI();
                      fingerprintID = getFingerprintID();
                      console.log(fingerprintID);
                      var valuesFromGraph = PC.getValuesRow(e.toElement.innerHTML, 
                        'Count', 'abcd');
                      console.log('valuesFromGraph: '+valuesFromGraph);
                      console.log(valuesFromGraph);
                      $("#d3test").html('');
                      $("#d3test").graphicChart('init');
                      $("#d3test").graphicChart('drawBarChart', valuesFromGraph,valuesFromGraph,valuesFromGraph);


                      var pc = new PCAPI();
                      //$("#pcBarContentRoot").removeClass("hidden");
                      //$("#pcBarContentRoot").addClass("show");
                      $("#pcBarContent").populationChartsBar(pc,this,fingerprintID);
                      $("#pcBarContent").populationChartsBar('draw', pc);

                      
                      if ($(e.toElement.firstChild).hasClass('icon-ok')) 
                      {
                        $(e.toElement.firstChild).removeClass('icon-ok') 
                      }
                      else
                      {
                        $(e.toElement.firstChild).addClass('icon-ok') 
                      }
                      return false;
                    });
      };
      this.drawScales = function(){
      };
      this.bindScales = function(){
      };   
    };

    var methods = {
        init : function( options, api ) {

            var self = this;
            self.append("Characteristic Type: ");
            tmpUl = $('<ul class="nav nav-list nav-pills nav-stacked">');
            values = options.getChartTitles();
            self.append(tmpUl);
            $.each(values, function (data){
                if (values[data]==="")
                    return;
                console.log(values[data]);
                tmpUl.append('<li class=""><a class="graphTypes" href="#" onclick="return false;">'+values[data]+'</a></li>')
            });
            console.log(api);
            var myPC = options;
            
            filters = new Filters();
            filters.bindFilters();

        },
        draw : function( options ) {
            
        },

    };

    $.fn.populationChartsTypes = function(method) {
        // Method calling logic
        if ( methods[method] ) {
        return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
        return methods.init.apply( this, arguments );
        } else {
        $.error( 'Method ' + method + ' does not exist on jQuery.populationChartsTypes' );
        }
        return this;
    };
}( jQuery ));


$(document).ready(
    function(){


        var chartLayout = new ChartLayout();

        $("#pc_list").populationChartsTypes(chartLayout, PCAPI);
        $("#pc_list").populationChartsTypes('draw', chartLayout); 
        $(".graphTypes").each(function(d,a){
          console.log(a);
          if (d==0) $(this)[0].click()
        });
        }
    
);

