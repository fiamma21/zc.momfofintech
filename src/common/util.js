// 一些公用的方法集合
var until = {}
//项目地址配置
until.api = function() {
	return "http://192.168.1.216:8888/web-asset/";
	//return "http://zc.momfofintech.com/"
}

//项目名配置
until.projectName = function() {
	return "web-asset/";
	//return " ";
}
 /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * roundtag:舍入参数，默认 "round" 向上取,"floor"向下取,"round" 四舍五入
    * */
until.number_format=function(number, decimals,roundtag, dec_point, thousands_sep) {
   
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "round";
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
 
            var k = Math.pow(10, prec);
            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
 
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
//数字转换成以万为单位，小于一万显示该整数
until.thousandBit = function(s) {
	if(s == '0' || !s){
		return '0.00';
	}else if(s < 10000){
		return s;
	}else{
		return s/10000;
	}
}
//数字强制转换成以万为单位，小于一万显示小数
until.thousandBitInt = function(s) {
	if(s == '0' || !s){
		return '0.00';
	}else{
		return s/10000;
	}
}

//数字转换成以万为单位，并且保留百千两位小数，千分位分隔
until.thousandBitFraction = function(s) {
	if(s == '0' || !s || s < 50){
		return '0.00';
	}else{
		//四舍五入到百位
		var n1 = Math.round(s / 100);
		//再除以100到万位
		var n2 = n1 / 100;
		//千分符处理
		return until.thousandBitSeparatorInt(n2);
	}
}

//千分为分隔符
//新需求,后台系统录入几位,就显示几位
until.thousandBitSeparatorInt = function(s) {
	if(s == '0'){
		return '0.00';
	}
	if(!s){
		return '';
	}
	s = s + '';
	var l = s.split('.')[0].split('').reverse(),
		r = s.split('.')[1];
	var t = '';
	if(l){
		for(var i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
		}
	}
	var re = '';
	if(r){
		if(r.length > 2){
			r = r.substr(0,2);
		} else {
			var l = r.length;
			while(l != 2){
				r = r + '0';
				l++;
			}
		}
		re = t.split('').reverse().join('') + '.' + r;
	}else{
		re = t.split('').reverse().join('') + '.00';
	}
	return re;
}
//千分为分隔符
//整数的千分位处理，强制去掉小数
until.thousandBitSeparator = function(s) {
	if(s == '0' || !s){
		return '0';
	}
	s = s + '';
	var l = s.split('.')[0].split('').reverse(),
		r = s.split('.')[1];
	var t = '';
	if(l){
		for(var i = 0; i < l.length; i++) {
			t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
		}
	}
	var re = '';
	if(r){
		if(r.length > 2){
			r = r.substr(0,2);
		} else {
			var l = r.length;
			while(l != 2){
				r = r + '0';
				l++;
			}
		}
		re = t.split('').reverse().join('');
	}else{
		re = t.split('').reverse().join('');
	}
	return re;
}

// yyyy-mm-dd 转为 yyyy.mm.dd
until.forMate = function (time) {
  if (!time) return ''
  return time.replace(/[-]/g, '.')
}

// 授信状态,0:未授信,1:已授信,2:授信过期
until.creditState = function (str) {
  let num = str;
  let creditArr = ['未授信', '已授信', '授信过期']
  return creditArr[num]
}

// 可接受还款方式(1.等额本息、2.等额本金、3.期初付息，按月还本、4.按月付息、到期还本)
until.ParseRepaymentMethod = function (str) {
  let num = !str ? 0 : (str - 0)
  let RepayArr = ['', '等额本息', '等额本金', '期初付息，按月还本','按月付息、到期还本']
  return RepayArr[num]
}

// 可接受投资期限(1.3个月、2.6个月、3.9个月、4.12个月)
until.ParseInvestmentTerm = function (str) {
	let num = !str ? 0 : (str - 0)
  let ParseArr = ['-', '3个月', '6个月', '9个月', '12个月']
  return ParseArr[num]
}

// 项目资产类型
until.assetTypeText = function (str) {
  let num = !str ? 0 : (str - 0)
  let assetArr = ['-', '集中式公寓', '分散式公寓', '酒店', '商业地产']
  return assetArr[num]
}

// 产品发行状态(1、待发行 2、募集中、3.存续期、4.已结算 5、发行失败)
until.ParseReleaseStatus = function (str) {
  let num = !str ? 0 : (str - 0)
  let ReleaseArr = ['待发行','待发行', '募集中', '存续期', '已结算','发行失败']
  return ReleaseArr[num]
}

// 表单提交 data.action提交地址,data.data提交参数
until.createForm = function (data, target) {
	function createInput (sfForm, type, name, value) {
		let tmpInput = document.createElement("input")
		tmpInput.type = type
		tmpInput.name = name
		tmpInput.value = value
		sfForm.appendChild(tmpInput)
	}
	let sfForm = document.createElement("form")
	document.body.appendChild(sfForm)
	let req = data.data
	for (var name in req) {
		createInput(sfForm, "text", name, req[name])
	}
	sfForm.method = "post"
	sfForm.action =until.api() + data.action
	sfForm.style.display = 'none'
//		sfForm.target = '_blank';
	sfForm.submit();
}

// 产品类型
until.productText = function (str) {
  let num = !str ? 0 : (str - 0)
  let productArr = ['-', '供应链金融', '租约证券化', '契约式基金', '租约贴现', '消费金融', '股权融资']
  return productArr[num]
}

// 产品期限单位
until.termUnitText = function (str) {
  let num = !str ? 0 : (str - 0)
  let termUnitArr = ['-', '日', '个月', '季度', '年']
  return termUnitArr[num]
}

// 资金结算方式F
until.methodText = function (str) {
  let num = !str ? 0 : (str - 0)
  let methodArr = ['-', '按月等额本息', '按季等额本息', '按月付息，到期还本', '到期还本付息']
  return methodArr[num]
}

// 运营状态
until.perationText = function (str) {
  let num = !str ? 0 : (str - 0)
  let perationArr = ['-', '出租中', '未出租', '终止运营']
  return perationArr[num]
}

export default until
