export function change(data){
	console.log('执行change函数')
			for(let i=0;i<data.length;i++){
				data[i]['key'] = data[i].id;
				if(data[i].status){
					console.log('fd')
					data[i].status = '在产';
				}else{
					console.log('dfd')
					data[i].status = '停产';
				}
			}
			this.setState({
				data: data,
			});
		}
