/**
 * 
 */

//初始化设备管理界面
function initequipment(funcWin)
{
	funcWin.tabs('add',{
		 title: '设备管理',        			 
		 closable: true,
		 content:'<div style="padding:1px">' +
			     '<table id="dg_fc_equipment"></table>'+
		         '<div id="dl_fc_equipment"></div>' +
			     '</div>'
	});
	
	var equipmentlist = $('#dg_fc_equipment'); //加载设备列表界面
	var equipmentdialog = $('#dl_fc_equipment'); //加载设备详细信息对话框

	equipmentdialog.dialog({
	    title: '设备信息',
		width: 300,
		height: 250,
		closed: true,
		cache: false,
		content: '<form id="fm_fc_equipment" method="post">' +
		         '<input name="equipment_id" type="hidden" value="">' +
		         '<div style="text-align:center;padding:5px"><label>设备名称：</label><input name="equipment_name" class="easyui-textbox" required="true"></div>' +		
		         '<div style="text-align:center;padding:5px"><label>设备编号：</label><input name="equipment_code" class="easyui-textbox" required="true"></div>' +
		         '<div style="text-align:center;padding:5px"><label>设备类型：</label><input name="equipment_type" class="easyui-textbox" required="true"></div>' + 
		         '<div style="text-align:center;padding:5px"><label>生产厂商：</label><input name="equipment_manufacturer" class="easyui-textbox" required="true"></div>' +
		         '<div style="text-align:center;padding:5px"><label>设备状态：</label><input id="fm_fc_equipment_id" name="equipment_state" class="easyui-combobox" required="true"></div>' +
		         '</form>',
		modal: true,
		buttons:[{
			text:'保存',
			width:90,
			handler:function(){				
				$('#fm_fc_equipment').form('submit',{
					url:'saveEquipment.do',
					success:function(data){
						var result = eval('(' + data + ')');
						$.messager.show({title: '信息', msg: result.message});
						$('#fm_fc_equipment').form('clear');
						equipmentdialog.dialog('close');
                	    equipmentlist.datagrid('reload');   
				    }    
				}
				)
			}
		},{
			text:'清空',
			width:90,
			handler:function(){
				$('#fm_fc_equipment').form('clear');
			}
		}]
	});

    $("#fm_fc_equipment_id").combobox({
      valueField:'code',
      textField:'text',
      data:[{code:1,text:'正常'},{code:2,text:'维护'},{code:3,text:'停用'},{code:4,text:'报废'}]
    });

	equipmentlist.datagrid({
		 title:'设备列表',
	     url:'listEquipment.do',
		 loadMsg:'正在加载设备信息，请稍后...',
		 height:$(window).height()-125,
		 pagination:true,
		 columns:[[
              {field:'equipment_id',checkbox:true}, 
		      {field:'equipment_name',title:'设备名称',width:100},
		      {field:'equipment_code',title:'设备编号',width:100},
		      {field:'equipment_type',title:'设备类型',width:100},
		      {field:'equipment_manufacturer',title:'生产厂商',width:100},
		      {field:'equipment_state',title:'设备状态',width:100,align:'center',formatter:function(value,row){
		    		 if(row.equipment_state==1)
		    			 return '正常';
		    		 if(row.equipment_state==2)
		    			 return '维护';
		    		 if(row.equipment_state==3)
		    			 return '停用';
		    		 if(row.equipment_state==4)
		    			 return '报废';		    		 
		    	  },
		    	  styler:function(value,row,index){
		    		  switch(value)
		    		  {
		    		     case 1:return 'color:green;';
		    		     case 2:return 'color:yellow;';
		    		     case 3:return 'color:red;';
		    		     case 4:return 'color:blue;';
		    		  }	  
		    	  }},
		 ]],
	     toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){
				    equipmentdialog.dialog('open').dialog('setTitle','新建设备');
				    }
			},'-',{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){			    
					    var rows = equipmentlist.datagrid('getChecked');
					    if(rows.length!=1)
					    {
					    	  $.messager.alert('警告','请选择条记录!','警告');
					    	  return;
					    }		
					    $('#fm_fc_equipment').form('load','loadEquipment.do?id=' + rows[0].equipment_id);
					    equipmentdialog.dialog('open').dialog('setTitle','修改设备');
				     }
			},'-',{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){				       
				       var rows = equipmentlist.datagrid('getChecked');
				       var ids = [];
				       if(rows.length==0)
				       {
				    	  $.messager.alert('警告','请先选择要删除的记录！','警告');
				    	  return;
				       }				    	   
				       for(var i=0;i<rows.length;i++)
				    	  ids.push(rows[i].equipment_id);
				       $.post('delEquipment.do',{"delids":ids.toString()},function(data){
				    	                                var result = eval('(' + data + ')');
				    	                                if (result.success){
				    	                            	    $.messager.show({title: '信息', msg: result.message});
				    	                            	    equipmentlist.datagrid('reload'); 
				    	                            	}
				    	                                else
				    	                                    $.messager.show({title: '错误',msg: result.message});
			           })
			         }
		     }]
   });
}

function initmaterial(funcWin)
{
	
	funcWin.tabs('add',{
		 title: '物料管理',        			 
		 closable: true,
		 content:'<div style="padding:1px">' +
			     '<table id="dg_fc_material"></table>'+
		         '<div id="dl_fc_material"></div>' +
			     '</div>'
	});
	
	var materiallist = $('#dg_fc_material'); //加载物料列表界面
	var materialdialog = $('#dl_fc_material');   //加载物料详细信息对话框
	
	materialdialog.dialog({
	    title: '物料信息',
		width: 300,
		height: 250,
		closed: true,
		cache: false,
		content: '<form id="fm_fc_material" method="post">' +
		         '<input name="material_id" type="hidden" value="">' +
		         '<div style="text-align:center;padding:5px"><label>物料名称：</label><input name="material_name" class="easyui-textbox" required="true"></div>' +		
		         '<div style="text-align:center;padding:5px"><label>物料编码：</label><input name="material_code" class="easyui-textbox" required="true"></div>' +
		         '<div style="text-align:center;padding:5px"><label>物料规格：</label><input name="material_spec" class="easyui-textbox" required="true"></div>' + 
		         '<div style="text-align:center;padding:5px"><label>生产厂商：</label><input name="material_manufacturer" class="easyui-textbox" required="true"></div>' +
		         '<div style="text-align:center;padding:5px"><label>物料数量：</label><input name="material_quantity" class="easyui-textbox" required="true"></div>' +
		         '</form>',
		modal: true,
		buttons:[{
			text:'保存',
			width:90,
			handler:function(){				
				$('#fm_fc_material').form('submit',{
					url:'saveMaterial.do',
					success:function(data){
						var result = eval('(' + data + ')');
						$.messager.show({title: '信息', msg: result.message});
						$('#fm_fc_material').form('clear');
						materialdialog.dialog('close');
                	    materiallist.datagrid('reload');   
				    }    
				})
			}
		},{
			text:'清空',
			width:90,
			handler:function(){}
		}]
	});

	materiallist.datagrid({
	     url:'listMaterial.do',
		 loadMsg:'正在加载用户信息，请稍后...',
		 height:$(window).height()-130,
		 pagination:true,
		 columns:[[
              {field:'material_id',checkbox:true}, 
		      {field:'material_name',title:'物料名称',width:100},
		      {field:'material_code',title:'物料编码',width:100},
		      {field:'material_spec',title:'物料规格',width:100},
		      {field:'material_manufacturer',title:'生产厂商',width:100},
		      {field:'material_quantity',title:'物料数量',width:100}
		 ]],
	     toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){
				    materialdialog.dialog('open').dialog('setTitle','新建物料');
				    }
			},'-',{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){			    
					    var rows = materiallist.datagrid('getChecked');
					    if(rows.length!=1)
					    {
					    	  $.messager.alert('警告','请选择单条记录!','警告');
					    	  return;
					    }		
					    $('#fm_fc_material').form('load','loadMaterial.do?id=' + rows[0].material_id);
					    materialdialog.dialog('open').dialog('setTitle','修改物料');
				     }
			},'-',{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){				       
				       var rows = materiallist.datagrid('getChecked');
				       var ids = [];
				       if(rows.length==0)
				       {
				    	  $.messager.alert('警告','请先选择要删除的记录！','警告');
				    	  return;
				       }				    	   
				       for(var i=0;i<rows.length;i++)
				    	  ids.push(rows[i].material_id);
				       $.post('delMaterial.do',{"delids":ids.toString()},function(data){
				    	                                var result = eval('(' + data + ')');
				    	                                if (result.success){
				    	                            	    $.messager.show({title: '信息', msg: result.message});
				    	                            	    materiallist.datagrid('reload'); 
				    	                            	}
				    	                                else
				    	                                    $.messager.show({title: '错误',msg: result.message});
			           })
			         }
		     }]
   });
}

//初始化产品管理界面
function initproduct(funcWin)
{
	funcWin.tabs('add',{
		 title: '产品管理',        			 
		 closable: true,
		 content:'<div style="padding:1px">' +
			     '<table id="dg_fc_product"></table>'+
		         '<div id="dl_fc_product"></div>' +
		         '<div id="dl2_fc_product"></div>' +
			     '</div>'
	});
	
	var productlist = $('#dg_fc_product');  //加载产品列表界面
	var productdialog = $('#dl_fc_product');    //加载产品详细信息对话框
	var processdialog = $('#dl2_fc_product');   //加载工艺详细信息对话框
	var editIndex = undefined;  //当前正处于编辑状态的行索引
	var ifrepeat = false;       //工序名称是否重复标识
	var sequence = 0;           //工序序列

	processdialog.dialog({
	    title: '工艺信息设置',
		width: 500,
		top:100,
		height: 500,
		closed: true,
		cache: false,
		content: '<div class="easyui-panel" width="100%">'+
			     '<form id="fm2_fc_process" method="post">' +
		         '<input id="procedure_identify" name="product_id" type="hidden" value="">' +
		         '</form><div class="easyui-panel" width=100%>' + 
		         '<div><table id="dg2_fc_process" width="100%"></table></div>',
		modal: true,
		buttons:[{
			text:'保存',
			width:90,
			handler:function(){	
				if (!dg2.datagrid('validateRow', editIndex))
					 return;
				dg2.datagrid('endEdit',editIndex);	
	    		if(ifrepeat)
	    		{
	    			 dg2.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
	    			 return;
	    		}	   
				editIndex = undefined;
				$('#fm2_fc_process').form('submit',{
					url:'addProductProcess.do',
					onSubmit:function(param){
						param.process_itemlist = JSON.stringify(dg2.datagrid('getRows'));
						},
					success:function(data){
						var result = eval('(' + data + ')');
						$.messager.show({title: '信息', msg: result.message});
						processdialog.dialog('close');
						dg2.datagrid('loadData',{total:0,rows:[]});					
						productlist.datagrid('reload'); 
                	    sequence = 0;
				    }    
				})
			}
		    },{
			text:'清空',
			width:90,
			handler:function(){
				dg2.datagrid('loadData',{total:0,rows:[]});
				sequence = 0;
			}
		}],
	onClose:function()
	{
		dg2.datagrid('loadData',{total:0,rows:[]});
		sequence = 0 ;
	}
	});
	
	var dg2 = $('#dg2_fc_process');
	dg2.datagrid({
		    singleSelect:true,
		    toolbar:
		    	[{text:'添加异步工序',
				iconCls:'icon-add',
				handler:function(){
					 if(editIndex !=undefined)
				     {
						 if (!dg2.datagrid('validateRow', editIndex))
							 return;
						 dg2.datagrid('endEdit',editIndex);
						 if(ifrepeat)
					     {
							    dg2.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex); 
							    return;
						 }
						 editIndex = undefined;
					 }
					 if(editIndex ==undefined){
						 dg2.datagrid('appendRow',{productprocess_sequence:(++sequence)});
						 editIndex = dg2.datagrid('getRows').length-1;
						 dg2.datagrid('beginEdit', editIndex);
					 } 
				}},"-",
				{text:'添加同步工序',
					iconCls:'icon-add',
					handler:function(){
						 if(editIndex !=undefined)
					     {
							 if (!dg2.datagrid('validateRow', editIndex))
								 return;
							 dg2.datagrid('endEdit',editIndex);
							 if(ifrepeat)
						     {
								    dg2.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex); 
								    return;
							 }
							 editIndex = undefined;
						 }
						 if(editIndex ==undefined){
							 dg2.datagrid('appendRow',{productprocess_sequence:(sequence)});
							 editIndex = dg2.datagrid('getRows').length-1;
							 dg2.datagrid('beginEdit', editIndex);
						 } 
					}}
		    	],
			columns:[[
		              {field:'productprocess_sequence',title:'工序顺序',width:100}, 
				      {field:'productprocess_proceduce',title:'工序名称',width:100,
		            	  editor:{
		            		       type:'combobox',
		            		       options:{
		            		    	   required:true,
		            		    	   editalbe:false,
		            		    	   valueField:'procedure_code',
		            		    	   textField:'procedure_name',
		            		    	   url:'loadProcedureList.do'		            		    	   
		            		       }}},
				      {field:'productprocess_failspro',title:'打回跳转',width:100,editor:{type:'validatebox',options:{required:true}}},,
				 ]],
	       onClickRow:function(index)
	       {
	    	   if (!dg2.datagrid('validateRow', editIndex)||index==editIndex)
	    	   {
	    		   dg2.datagrid('selectRow', editIndex);
	    		   return;
	    	   }	 
	    	   else{
	    		   dg2.datagrid('endEdit',editIndex);
	    		   if(ifrepeat)
	    		   {
	    			   dg2.datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);
	    			   return;
	    		   }	    			   
	    		   dg2.datagrid('selectRow', index).datagrid('beginEdit', index);
	    		   editIndex = index;
	    	   }	 
	       },
	       onEndEdit:function(rowIndex,rowData,changes)
	       {
	          var rows = dg2.datagrid('getRows');
	          for(var i=0;i<rows.length;i++)
	          {
	        	  if(i==rowIndex)
	        		  continue;
	        	  if(rowData.productprocess_proceduce==rows[i].productprocess_proceduce)
	        	  {
	        		  $.messager.alert('错误','工序不能重复，请修改！','错误');
	        	  	  ifrepeat = true;
	        	  	  return;
	        	  } 
	          }
	          ifrepeat = false;
	       }
	});
	
	productdialog.dialog({
	    title: '产品信息',
		width: 300,
		height: 250,
		closed: true,
		cache: false,
		content: '<form id="fm_fc_product" method="post">' +
		         '<input name="product_id" type="hidden" value="">' +
		         '<div style="text-align:center;padding:5px"><label>产品名称：</label><input name="product_name" class="easyui-textbox" required="true"></div>' +		
		         '<div style="text-align:center;padding:5px"><label>产品编码：</label><input name="product_code" class="easyui-textbox" required="true"></div>' +
		         '<div style="text-align:center;padding:5px"><label>执行标准：</label><input name="product_spec" class="easyui-textbox" required="true"></div>' + 
		         '<div style="text-align:center;padding:5px"><label>产品钢级：</label><input name="product_steelgrade" class="easyui-textbox" required="true"></div>' +
		         '</form>',
		modal: true,
		buttons:[{
			text:'保存',
			width:90,
			handler:function(){				
				$('#fm_fc_product').form('submit',{
					url:'saveProduct.do',
					success:function(data){
						var result = eval('(' + data + ')');
						$.messager.show({title: '信息', msg: result.message});
						$('#fm_fc_product').form('clear');
						productdialog.dialog('close');
                	    productlist.datagrid('reload');   
				    }    
				}
				)
			}
		},{
			text:'清空',
			width:90,
			handler:function(){}
		}]
	});

	productlist.datagrid({
	     url:'listProduct.do',
	     height:$(window).height()-130,
		 loadMsg:'正在加载产品类型信息，请稍后...',
		 pagination:true,
		 columns:[[
              {field:'product_id',checkbox:true}, 
		      {field:'product_name',title:'产品类型名称',width:100},
		      {field:'product_code',title:'产品类型编码',width:100},
		      {field:'product_spec',title:'执行标准',width:100},
		      {field:'product_steelgrade',title:'产品钢级',width:100}
		 ]],
	     toolbar:[{
			text:'添加',
			iconCls:'icon-add',
			handler:function(){
				    productdialog.dialog('open').dialog('setTitle','新建产品类型');
				    }
			},'-',{
			text:'修改',
			iconCls:'icon-edit',
			handler:function(){			    
					    var rows = productlist.datagrid('getChecked');
					    if(rows.length!=1)
					    {
					    	  $.messager.alert('警告','请选择记录!','警告');
					    	  return;
					    }		
					    $('#fm_fc_product').form('load','loadProduct.do?id=' + rows[0].product_id);
					    productdialog.dialog('open').dialog('setTitle','修改产品类型');
				     }
			},'-',{
			text:'删除',
			iconCls:'icon-remove',
			handler:function(){				       
				       var rows = productlist.datagrid('getChecked');
				       var ids = [];
				       if(rows.length==0)
				       {
				    	  $.messager.alert('警告','请先选择要删除的记录！','警告');
				    	  return;
				       }				    	   
				       for(var i=0;i<rows.length;i++)
				    	  ids.push(rows[i].product_id);
				       $.post('delProduct.do',{"delids":ids.toString()},function(data){
				    	                                var result = eval('(' + data + ')');
				    	                                if (result.success){
				    	                            	    $.messager.show({title: '信息', msg: result.message});
				    	                            	    productlist.datagrid('reload'); 
				    	                            	}
				    	                                else
				    	                                    $.messager.show({title: '错误',msg: result.message});
			           })
			         }
		     },"-",{
					text:'产品工艺设置',
					iconCls:'icon-add',
					handler:function(){
						   
						procedure_identify
							
						    var rows = productlist.datagrid('getChecked');
						    if(rows.length!=1)
						    {
						    	  $.messager.alert('警告','请选择记录!','警告');
						    	  return;
						    }		
						    $('#procedure_identify').val(rows[0].product_id);
						    dg2.datagrid({ url:'loadProductProcess.do',queryParams:{id:rows[0].product_id},method:"post"});
						    processdialog.dialog('open').dialog('setTitle','产品工艺设置');
						    }
		     
					},]
   });
}
