//i stole this whole thing from the modding tree

function exponentialFormat(num, precision, mantissa = true) {
	let e = new Decimal(num.log10()).floor()
	let m = num.div(Decimal.pow(10, e))
	if(m.toStringWithDecimalPlaces(precision) == 10) {
		m = new Decimal(1)
		e = e.add(1)
	}
	e = (e.gte(10000) ? commaFormat(e, 0) : regularFormat(e, 0));
	if (mantissa)
		return Math.round(m)+"e"+e
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

function format(decimal, points=2) {
	decimal = new Decimal(decimal)
	if (decimal.gte("1e1000")) return exponentialFormat(decimal, 0, false)
	else if (decimal.gte(1e10)) return exponentialFormat(decimal, 0)
	else if (decimal.gte(1e4)) return exponentialFormat(decimal, 1)
	else return commaFormat(decimal, points)
}

function formatWhole(decimal) {
	decimal = new Decimal(decimal)
	//if (decimal.gte(1e9)) return format(decimal, 2)
	if (decimal.lte(0.98) && !decimal.eq(0)) return format(decimal, 2)
	return format(decimal, 0)
}

//end stolen from jacorb

