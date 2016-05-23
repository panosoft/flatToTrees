const expect = require('chai').expect;

const flatToTrees = require('../index.js');

describe('trees', function () {
	const o = [
		{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 3, 'ys.g': 12, 'ys.h': 20},
		{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 3, 'ys.g': 12, 'ys.h': 21},
		{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 4, 'ys.g': 12, 'ys.h': 22},
		{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 4, 'ys.g': 12, 'ys.h': 23},
		{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 4, 'ys.g': 12, 'ys.h': 24},
		{a: 1, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 5, 'ys.g': 13, 'ys.h': 25},
		{a: 1, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 5, 'ys.g': 14, 'ys.h': 26},
		{a: 1, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 15, 'ys.h': 27},
		{a: 1, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 16, 'ys.h': 28},
		{a: 1, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 17, 'ys.h': 29},
		{a: 1, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': null}, // null value
		{a: 1, 'ys.h': null, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 21}, // note this is out of order from the rest
		{a: 1, 'xs.b': 3, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': null}, // missing xs.x
		{a: 1, 'xs.b': 3, 'xs.x': 22222, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': null}, // should not be grouped with '22222'
		{a: 1, 'xs.b': 3, 'xs.x': '22222', 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': null}, // should not be grouped with 22222
		{'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': 99}, // missing a
		{'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': null}, // missing a
		{zz: 555, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': null}, // zzz instead of a
		{zz: 555, 'xs.b': 3, 'xs.x': 11, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': 5050}, // zzz instead of a
		{zz: 555, 'xs.b': 3, 'xs.x': {a:1}, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': 5050}, // has an object as a value
		{zz: 555, 'xs.b': 3, 'xs.x': {a:1}, 'xs.cs.d': 6, 'ys.g': 20, 'ys.h': 5050}, // has an object as a value
		{a: 1, 'b': 2, 'x': 10, 'd': 3, 'g': 12, 'h': 20},
	];
	it('flat to trees', () => {
		const ot = [ { a: 1,
		    xs:
		     [ { b: 2,
		         cs: [ { d: 3 }, { d: 3 }, { d: 4 }, { d: 4 }, { d: 4 } ],
		         x: 10 },
		       { b: 3,
		         cs:
		          [ { d: 5 },
		            { d: 5 },
		            { d: 6 },
		            { d: 6 },
		            { d: 6 },
		            { d: 6 },
		            { d: 6 } ],
		         x: 11 },
		       { b: 3, cs: [ { d: 6 } ] },
		       { b: 3, cs: [ { d: 6 } ], x: 22222 },
		       { b: 3, cs: [ { d: 6 } ], x: '22222' } ],
		    ys:
		     [ { g: 12, h: 20 },
		       { g: 12, h: 21 },
		       { g: 12, h: 22 },
		       { g: 12, h: 23 },
		       { g: 12, h: 24 },
		       { g: 13, h: 25 },
		       { g: 14, h: 26 },
		       { g: 15, h: 27 },
		       { g: 16, h: 28 },
		       { g: 17, h: 29 },
		       { g: 20, h: null },
		       { g: 21, h: null },
		       { g: 20, h: null },
		       { g: 20, h: null },
		       { g: 20, h: null } ] },
		  { xs: [ { b: 3, cs: [ { d: 6 }, { d: 6 } ], x: 11 } ],
		    ys: [ { g: 20, h: 99 }, { g: 20, h: null } ] },
		  { xs:
		     [ { b: 3, cs: [ { d: 6 }, { d: 6 } ], x: 11 },
		       { b: 3, cs: [ { d: 6 }, { d: 6 } ], x: { a: 1 } } ],
		    ys:
		     [ { g: 20, h: null },
		       { g: 20, h: 5050 },
		       { g: 20, h: 5050 },
		       { g: 20, h: 5050 } ],
		    zz: 555 },
		  { a: 1, b: 2, d: 3, g: 12, h: 20, x: 10 } ];
		const trees = flatToTrees(o);
		expect(trees).to.deep.equal(ot);
	});
	it('flat to trees removeDuplicateLeaves', () => {
		const ot = [ { a: 1,
		    xs:
		     [ { b: 2, cs: [ { d: 3 }, { d: 4 } ], x: 10 },
		       { b: 3, cs: [ { d: 5 }, { d: 6 } ], x: 11 },
		       { b: 3, cs: [ { d: 6 } ] },
		       { b: 3, cs: [ { d: 6 } ], x: 22222 },
		       { b: 3, cs: [ { d: 6 } ], x: '22222' } ],
		    ys:
		     [ { g: 12, h: 20 },
		       { g: 12, h: 21 },
		       { g: 12, h: 22 },
		       { g: 12, h: 23 },
		       { g: 12, h: 24 },
		       { g: 13, h: 25 },
		       { g: 14, h: 26 },
		       { g: 15, h: 27 },
		       { g: 16, h: 28 },
		       { g: 17, h: 29 },
		       { g: 20, h: null },
		       { g: 21, h: null } ] },
		  { xs: [ { b: 3, cs: [ { d: 6 } ], x: 11 } ],
		    ys: [ { g: 20, h: 99 }, { g: 20, h: null } ] },
		  { xs:
		     [ { b: 3, cs: [ { d: 6 } ], x: 11 },
		       { b: 3, cs: [ { d: 6 } ], x: { a: 1 } } ],
		    ys: [ { g: 20, h: null }, { g: 20, h: 5050 } ],
		    zz: 555 },
		  { a: 1, b: 2, d: 3, g: 12, h: 20, x: 10 } ];
		const trees = flatToTrees(o, {removeDuplicateLeaves: true});
		expect(trees).to.deep.equal(ot);
	});
	it('flat to trees with delimiter', () => {
		const o = [
			{a: 1, 'xs/b': 2, 'xs/x': 10, 'xs/cs/d': 3, 'ys/g': 12, 'ys/h': 20},
			{a: 1, 'xs/b': 2, 'xs/x': 10, 'xs/cs/d': 3, 'ys/g': 12, 'ys/h': 21},
		];
		const ot = [ { a: 1,
		    xs: [ { b: 2, cs: [ { d: 3 }, { d: 3 } ], x: 10 } ],
		    ys: [ { g: 12, h: 20 }, { g: 12, h: 21 } ] } ];
		const trees = flatToTrees(o, {delimiter: '/'});
		expect(trees).to.deep.equal(ot);
	});
});

describe('non-trees', function () {
	it('flat to trees', () => {
		const o = [
			{a: 1, 'b': 2, 'x': 10, 'd': 3, 'g': 12, 'h': 20},
			{a: 1, 'b': 2, 'x': 10, 'd': 3, 'g': 12, 'h': 20},
			{a: 1, 'b': 3, 'x': 11, 'd': 3, 'g': 12, 'h': 20},
			{a: 1, 'b': 3, 'x': 12, 'd': 3, 'g': 12, 'h': 20},
			{a: 1, 'b': 4, 'x': 13, 'd': 3, 'g': 12, 'h': 20},
		];
		const trees = flatToTrees(o);
		expect(trees).to.deep.equal(o);
	});
});
