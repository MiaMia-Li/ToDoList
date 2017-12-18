$(function(){
	var $form_add_task=$('.add-task'),
	    $task_detail=$('.task-detail'),
	task_list={};
	init();

	$form_add_task.on("submit",function(e){
		var new_task={};
		$input=$(this).find('input[name="content"]');
		e.preventDefault();//禁用默认行为
		new_task.content=$(this).find('input[name="content"]').val();
		if(!new_task.content) return;
		if(add_task(new_task)){
			render_task_list();
			$input.val(null);
		}
	})

	$("body").on("click","#delete",function(){
		var $item=$(this).parent().parent();
		var index=$item.data('index');
		var tmp=confirm('确定删除?');
        tmp?delete_task(index):null;
	})
	$("body").on("click","#detail",function(){
		var $item=$(this).parent().parent();
		var index=$item.data('index');
		show_task_detail(index);
	})
	$("body").on("click","#complete",function(){
		var index=$(this).parent().parent().data('index');
		var item=store.get('task_list')[index];
		if(item.complete){
			update_task(index,{complete:false});
			//$(this).attr('checked',true);
		}else{
			update_task(index,{complete:true});
			//$(this).attr('checked',false);
		}
	})
	function show_task_detail(index){
		$(".task-detail-mask").show();
		$(".task-detail").show();
		render_task_detail(index);
	}
	function render_task_detail(index){
		if(index===undefined||!task_list[index])
			return;
		var item=task_list[index];
		var tpl='<form>'+
		    '<div class="content">'+item.content+'</div>'+
		    '<input id="add" style="display:none" type="text" name="content" value="'+item.content+'">'+
		    '<textarea name="desc">'+(item.desc||'')+'</textarea>'+
		    '<div class="remind">'+
	            '<label>提醒时间</label>'+'<input type="date" name="remind_date" value="'+item.remind_date+'">'+
	             '<button type="submit">更新</button>'+
		    '</div>'+
		    '</form>';
		$task_detail.html(null);
		$task_detail.html(tpl);
		var $update_form=$task_detail.find('form');
		$task_detail_content=$update_form.find(".content");
		$task_detail_content_input=$update_form.find('[name=content]');
		$task_detail_content.on("dblclick",function(){
			$task_detail_content.hide();
			$task_detail_content_input.show();
		})
		$update_form.on('submit',function(e){
			e.preventDefault();
			var data={};
			data.content=$(this).find('[name=content]').val();
			data.desc=$(this).find('[name=desc]').val();
			data.remind_date=$(this).find('[name=remind_date]').val();
			update_task(index,data);
			$(".task-detail-mask").hide();
		    $(".task-detail").hide();
		})

	}
	function update_task(index,data){
		if(!index||!task_list[index])
			return;
		task_list[index]=$.extend({},task_list[index],data);
		refresh_task_list();
	}
	$(".task-detail-mask").on("click",function(){
		$(".task-detail-mask").hide();
		$(".task-detail").hide();
	})
	function add_task(new_task){
		task_list.push(new_task);
		store.set('task_list',task_list);
		return true;
	}
	function refresh_task_list(){
		store.set('task_list',task_list);
		render_task_list();
	}
	function delete_task(index){
		if(index===undefined||!task_list[index]) return;
		 delete task_list[index];
		 refresh_task_list();
	}
	function init(){
		task_list=store.get('task_list')||[];
		if(task_list){
			render_task_list();
		}
	}
	function render_task_list(){
		var $task_list=$(".task-list");
		$task_list.html('');
		var complete_items=[];
		var item=task_list[i];
		for(var i=0;i<task_list.length;i++){
			var item=task_list[i];
			if(item&&item.complete){
				complete_items[i]=item;
			}else{
			var $task=render_task_item(task_list[i],i);
			$task_list.prepend($task);
		    }
		}
		for (var j=0;j<complete_items.length;j++){
			$task=render_task_item(complete_items[j],j);
			if(!$task) continue;
			$task.addClass("completed");
			$task_list.append($task);
		}
	}
	function render_task_item(data,index){
		if(!data||!index) return;
		var list_item_tpl='<div class="task-item" data-index="'+index+'">'+
					'<span><input type="checkbox" id="complete" class=(data.complete?"checked":"")></span>'+
					'<span class="task-content">'+data.content+'</span>'+
					'<span class="fr">'+
					'<span class="pic" id="delete"> 删除</span>'+
					'<span class="pic" id="detail"> 详细</span>'+
					'<span>'+
				    '</div>';
	    return $(list_item_tpl);

	}


});