document.addEventListener('DOMContentLoaded', function(){
	Vue.directive('auto-focus', {
		inserted: function (el) {
			el.focus();
		}
	});
	var app = new Vue({
		el: '#list',
		data: {
			lists:[],
			id: 0,
			item: '',
			price: '',
			invalue: true,
			edit_flag: {
				item: false,
				price: false,
			},
		},
		created: function(){
			this.getList();
			if(this.lists.length > 0){
				var max_id = this.lists[this.lists.length - 1].id;
				this.id = max_id + 1;
			}
		},
		computed: {
			countItem: function(){
				return this.lists.length;
			},
			sumPrice: function(){
				var price = 0;
				var sum_price = 0;
				this.lists.forEach(function(value){
					price = Number(value.price.replace(/[^0-9|^０-９]/g,''));
					sum_price += price;
				});
				return sum_price.toLocaleString();
			}
		},
		methods: {
			addData: function(id){
				if(this.item != '' && this.price != ''){
					this.lists.push({
						id: this.id,
						item:this.item,
						price:priceFormat(this.price),
						edit_flag: this.edit_flag,
					});
					this.id += 1;
					this.item = '';
					this.price = '';
					this.invalue = true;
					this.setList();
				}else{
					this.invalue = false;
				}
			},
			updateList: function(list, event){
				if(list.item != '' && list.price != ''){
					list.edit_flag = {item: false,price: false};
					if(event.type == 'keyup'){
						return false;
					}
					list.price = priceFormat(list.price);
					this.setList();
					this.invalue = true;
				}else{
					this.invalue = false;
				}
			},
			delelteList: function(list){
				var index = this.lists.indexOf(list);
				this.lists.splice(index,1);
				this.setList();
			},
			setList: function(){
				localStorage.lists = JSON.stringify(this.lists);
			},
			getList: function(){
				if(typeof localStorage.lists === 'undefined' ){
					this.lists = [];
				}else{
					this.lists = JSON.parse(localStorage.lists);
				}
			},
		}
	});

	function priceFormat(price){
		var num_price = zenhan(price.replace(/[^0-9|^０-９]/g,''));
		return num_price.toLocaleString();
	}
	function zenhan(a){
		//10進数の場合
		a = a.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
			return String.fromCharCode(s.charCodeAt(0) - 65248);
		});

		//16進数の場合
		a =a.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
			return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
		});

		return Number(a).toLocaleString();
	}

});
