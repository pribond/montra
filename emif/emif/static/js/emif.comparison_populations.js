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


function postComparisonPopulations(){
    $('#compare_form').attr('action', 'population/compare');
    postComparison();

   return true; 
};

function checkExistsPopulation(fingerprint_ids){
	console.log(fingerprint_ids)
	$.post( "api/populationcheck", { 'ids[]': fingerprint_ids })
		.done(function( data ) {
			console.log('LOG:'+data.contains_population);
			if(data.contains_population){
				$('#submitdbsimulate').click();
			} else {
				alert('Cant');
			}
	}).fail(function( data ) {
		alert('Failed try again.');
	});	
}

$(document).ready(function(){

    $("#comparabtnPC").bind('click',function(e)
        { 

                event.preventDefault();


          postComparisonPopulations();
          return false;
        });

});