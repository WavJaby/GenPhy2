const problemInitFunctions = [];

function init() {
	const latexDictionary = ComputeEngine.ComputeEngine.getLatexDictionary();
	for (const l of latexDictionary) {
		if (l.trigger && l.trigger[0] && l.trigger[0].startsWith('\\placeholder'))
			l.parse = e => {
				e.skipSpaceTokens();
				if (e.match('['))
					for (; !e.match(']') && !e.atBoundary;)
						e.next();
				let n = e.matchExpression();
				return null === n ? ['Placeholder', n, ['Error', '\'missing\'']] : n;
			}
		// else if (l.name === 'Equal') {
		// 	l.parse = (e, i, j) => {
		// 		console.log(e, i, j);
		// 		let n = e.matchExpression();
		// 		return null === n ? ['Equal', n, ['Error', '\'missing\'']] : n;
		// 	}
		// 	console.log(l)
		// }
		// if (l.trigger && l.trigger[0] && l.trigger[0].indexOf(',') != -1)
		// console.log(l)
	}

	const ce = new ComputeEngine.ComputeEngine({latexDictionary: latexDictionary});
	ce.latexOptions.notation = 'scientific';
	ce.latexOptions.exponentProduct = '\\times';
	ce.latexOptions.precision = 5;
	const n = ce.box('Epsilon_0');
	n.value = '8.854187817e-12';
	console.log(ce.latexOptions);
	// ce.assume('\\epsilon_0', '8.854187817\\times10^{-12}')

	const separatorHalf = {label: '[separator]', width: 0.5};
	mathVirtualKeyboard.layouts = [{
		label: 'Basic',
		rows: [
			[
				'[7]', '[8]', '[9]', '[/]', separatorHalf,
				{class: 'small', latex: '\\frac{#@}{{#0}}'},
				'{#@}^{#0}',
				'\\sqrt{#0}',
				{label: '[backspace]', width: 1},
			],
			[
				'[4]', '[5]', '[6]', '[*]', separatorHalf,
				'[(]', '[)]', {class: 'small', latex: '{#@}\\cdot{10^{#0}}'},
				'\\le',
			],
			[
				'[1]', '[2]', '[3]', '[-]', separatorHalf,
				'[', ']', {width: 2, label: '[shift]'},
			],
			[
				'[0]', '[.]', '[=]', '[+]', separatorHalf,
				'\\lbrace', '\\rbrace', '[left]', '[right]',
			],
		],
	}, 'numeric', 'symbols', 'alphabetic', 'greek'];

	function calculate(math, result) {
		const value = math.getValue('latex-expanded');
		// const symbol = math.getPromptValue('variable');
		// const setValue = math.getPromptValue('value');
		// if (symbol.length > 0 && setValue.length > 0)
		// 	ce.assume(symbol, setValue);
		// console.log(evaluatex(value)());
		console.log('raw', value);
		const expr = ce.parse(value);
		result.textContent = '\\(=' + expr.N().latex + '\\)';
		// console.log(expr.N().latex);
		// console.log(expr.simplify().json);

		MathLive.renderMathInElement(result);
	}

	this.setCalculate = function (math, result) {
		calculate(math, result);
		math.addEventListener('input', () => calculate(math, result));
	};

	// Init
	MathLive.renderMathInDocument();
	// mathVirtualKeyboard.show();

	const math = document.getElementById('math');
	const result = document.getElementById('result');
	math.addEventListener("focus", () => mathVirtualKeyboard.show());
	this.setCalculate(math, result);

	for (const initFunc of problemInitFunctions) {
		initFunc(this);
	}
}

// init();
window.addEventListener('load', init);