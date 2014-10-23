
function AjaxService(){

}

AjaxService.prototype.service = function(url, data, isGet){
	var def = $.Deferred();
	var transactionTypt = isGet?"GET":"POST";
	$.ajax({
            "type" : transactionTypt,
            "url" : url,
            "data":data,
            "contentType": "application/json",
            "dataType" : "json"
        }).done(function(data){
        	def.resolve(data);
        }).fail(function(error){
        	def.reject(error);
        });
    return def.promise();
};

AjaxService.prototype.serviceForJsonp = function(url, data, isGet){
	var def = $.Deferred();
	var transactionTypt = isGet?"GET":"POST";
	$.ajax({
            "type" : transactionTypt,
            "url" : url,
            "data":data,
            "contentType": "application/json",
            "dataType":"jsonp",
            "jsonp":"jsonp",
        }).done(function(data){
        	def.resolve(data);
        }).fail(function(error){
        	def.reject(error);
        });
    return def.promise();
};

function AjaxTask(url){
	this.url = url;
	this.ajaxService = new AjaxService();
}

AjaxTask.prototype.involve =function(data){
	console.log(data);
	return this.ajaxService.service(this.url, data);
};

function AjaxCenter(){
	this.configurationList = [];
	this.ajaxTaskList = [];
	
}
AjaxCenter.prototype.config = function(in_configuration){
	this.configurationList = in_configuration;
	var that = this;
	$(this.configurationList).each(function(index, item){
		if(item.name != "config"&&item.url&&typeof item.url=="string"&&item.name&&typeof item.name=="string"){
			var task = new AjaxTask(item);
			that.ajaxTaskList.push(task);
			if(item.process){
				task.involve = process;
			}
			that[item.name]=function(data){return task.involve.call(task,data)};
		}
	});
};
