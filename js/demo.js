$(function(){
	var $form_add_task=$('.add-task')
	,new_task={}
	,task_list={}
	;
	init();

	$form_add_task.on("submit",function(e){
		e.preventDefault();//禁用默认行为
		new_task.content=$(this).find('input[name="content"]').val();
		if(!new_task.content) return;
		if(add_task(new_task)){
			render_task_list();
		}
	})
	function add_task(new_task){
		task_list.push(new_task);
		store.set('task_list',task_list);
		console.log('task_list',task_list);
	}
	function init(){
		task_list=store.get('task_list')||[];
	}
	function render_task_list(){
		var $task_list=$(".task_list");
		for(var i=0;i<task_list.length;i++){
            var $task=render_task_tpl(task_list[i]);
            $task_list.append($task);
		}
	}
	function render_task_tpl(data){
		var list_item_tpl='<div class="task-item">'+
					'<span><input type="checkbox"></span>'+
					'<span class="task-content">'+data.content+'</span>'+
					'<span>删除</span>'+
					'<span>详细</span>'+
				    '</div>';
		console.log('1',list_item_tpl)
	    return $(list_item_tpl);

	}


}) 