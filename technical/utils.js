//i stole this mostly from the modding tree and made some edits

function exponentialFormat(num, precision, mantissa = true) {
	let e = new Decimal(num.log10()).floor()
	let m = num.div(Decimal.pow(10, e))
	if(m.toStringWithDecimalPlaces(precision) == 10) {
		m = new Decimal(1)
		e = e.add(1)
	}
	e = (e.gte(10000) ? commaFormat(e, 0) : regularFormat(e, 0));
	if (mantissa)
		return commaFormat(m, precision)+"e"+e
		else return "e"+e
	}

function commaFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	if (num.m < 0.001) return (0).toFixed(precision)
	return num.toFixed(precision).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
}


function regularFormat(num, precision) {
	if (num === null || num === undefined) return "NaN"
	if (num.m < 0.001) return (0).toFixed(precision)
	return num.toFixed(precision)
}

function formatDefault(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	else if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(0)) return commaFormat(decimal, 1)
	else return formatWhole(decimal)
}

function formatDefault2(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(100)) return commaFormat(decimal, 1)
	else if (decimal.gt(0)) return commaFormat(decimal, 2)
	else return formatWhole(decimal)
}

function formatUnitRow(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e6)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(0)) return commaFormat(decimal, 1)
	else return formatWhole(decimal)
}

function formatUnitRow2(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e6)) return exponentialFormat(decimal, 2)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else if (decimal.gt(100)) return commaFormat(decimal, 1)
	else if (decimal.gt(0)) return commaFormat(decimal, 2)
	else return formatWhole(decimal)
}

function formatWholeUnitRow(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	//if (decimal.gte(1e9)) return format(decimal, 2)
	if (decimal.lte(0.98) && !decimal.eq(0)) return format(decimal, 2)
	return formatUR(decimal, 0)
}

function formatUR(decimal, precision=2) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e6)) return exponentialFormat(decimal, precision)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}

function format(decimal, precision=2) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	if (decimal.gte("1e100000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
	else if (decimal.gte(1e3)) return commaFormat(decimal, 0)
	else return commaFormat(decimal, precision)
}

function formatWhole(decimal) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e9000000000000000")) return 'infinity';
	//if (decimal.gte(1e9)) return format(decimal, 2)
	if (decimal.lte(0.98) && !decimal.eq(0)) return format(decimal, 2)
	return format(decimal, 0)
}

//end stolen

function addFactorial(num) {
	var f = 0;
	while (num > 0) {
		f = f+num;
		num--;
	}
	return f
}