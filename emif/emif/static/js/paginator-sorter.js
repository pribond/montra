function PaginatorSorter(tableID, fString, selName, selValue){
    this.innerTable = $("#"+tableID);

    this.filters = [];
    this.filters["database_name_filter"] = $("#database_name_filter",this.innerTable);
    this.filters["last_update_filter"] = $("#last_update_filter",this.innerTable);
    this.filters["type_filter"] = $("#type_filter",this.innerTable);

    this.selName = selName;
    this.selValue = selValue;

    this.form = $("#send2");
    this.updateForm(this.getQueryString(selName, selValue));

    this.bind();

    this.fString = fString; 
}
PaginatorSorter.prototype ={
	getQueryString : function(fieldType, value){
		var data = [];
		
		if(fieldType == undefined)
			data[this.selName] = this.selValue;
		else 
			data[fieldType] = value;

		for(filter in this.filters){ 
			console.log(filter);
			if(this.filters[filter].val().length >= 2 ){
				data[filter] = this.filters[filter].val();
			}
		}

		var json = "{"
		first = true
		for(v in data){
			if(!first)
				json += ", "
			json += '"'+v+'": "'+data[v]+'"';
			first = false;
		}
		json += "}";
		//console.log(json);
		return json;
	},
	onClick : function(fieldType, value){
		var context = this;
		var data = [];

		var json = context.getQueryString(fieldType, value);

		var patt=/\/(\d+)/g;
		var page = patt.exec(window.location.href);
		if( page){
			page = page[1];
		}else{
			page = 1;
		}
		
		var f = this.fString;
		
		$.ajax({
			type: "POST",
  			dataType: "json",
  			url: "query/"+page,
  			data: {"filter": f, "s":json},
  			success: function(data){	
  				//console.log(data);
  				if(data.Hits != undefined && data.Hits > 0){ 			
			        context.updateForm(json);
			      
			        for(filter in context.filters){ 	
						if(context.filters[filter].val().length > 0 ){
							var x = $("#"+filter+"_grp");
							x.removeClass("error");
						}
					}

				  context.submit();
  				}else{
  					for(filter in context.filters){ 	
						if(context.filters[filter].val().length > 0 ){
							var x = $("#"+filter+"_grp");
							x.removeClass("success");
            				x.addClass("error");
						}
					}
  				}
  			}
		});
	} ,
	bind : function(){
		var value = this.filters["type_filter"].attr("def_value");

		$("option[value="+value+"]", this.filters["type_filter"]).attr("selected", "yes");

		var context = this;

		this.filters["database_name_filter"].keyup( $.debounce( 1000, function(){
				context.onClick(context.selName, context.selValue);
			}));
    	this.filters["last_update_filter"].keyup( $.debounce( 1000, function(){
				context.onClick(context.selName, context.selValue);
			}));
    	this.filters["type_filter"].change(function(){
				context.onClick(context.selName, context.selValue);
			});
	}, 
	updateForm : function(json){
		$("#s", this.form).val(json);
	}, 
	submit : function(json){
		this.form.submit();
	}
}

function paginator_via_post(){
	$("a",".pagination").each(function(){
	      $(this).click(function(e){
	       
	        var href = $(this).attr("href");
	         console.log(href);
	        var patt=/\/(\d+)/g;
	        var page = patt.exec(href);
	        if( page){
	          page = page[1];
	          var form = $("#send2");
	          $("#page", form).val(page);
	          form.submit();
	        }else{
	          page = "NULL";
	        }
	        e.preventDefault();
	      });

	    });
}