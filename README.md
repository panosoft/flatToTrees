# flatToTrees

Utility to convert flat data into hierarchical data. In particular, data returned from a SQL query.

This library was inspired by [`treeize`](https://www.npmjs.com/package/treeize) which removes duplicate leaves. `flatToTrees` can do this but is **NOT** the default behavior.

[`treeize`](https://www.npmjs.com/package/treeize) also doesn't work well with heterogenous records, i.e. records that have different columns and names. (This is less aggregious than the removal of duplicate leaves)

[![Travis](https://img.shields.io/travis/panosoft/flatToTrees.svg)](https://travis-ci.org/panosoft/flatToTrees)

## Installation

```sh
npm install flatToTrees
```

## Usage

```js
flatToTrees(obj, options)
```

__Arguments__

- `obj` - An object.
- `options`:
    - `delimiter` - (default: `.`) Path delimiter that defines the hierarchy.
    - `removeDuplicateLeaves` - (default: `false`) Flag to remove duplicate leaves in the trees.

__Example__
<a name="example"></a>
```js
const flatToTrees = require('flatToTrees');

const o = [
	{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 3, 'ys.g': 12, 'ys.h': 20},
	{a: 1, 'xs.b': 2, 'xs.x': 10, 'xs.cs.d': 3, 'ys.g': 12, 'ys.h': 21},
];
const trees = flatToTrees(o);
/*
	trees === [ { a: 1,
		xs: [ { b: 2, cs: [ { d: 3 }, { d: 3 } ], x: 10 } ],
		ys: [ { g: 12, h: 20 }, { g: 12, h: 21 } ] } ]
*/
```
If `removeDuplicateLeaves` was set to `true` in the `options` parameter, then:

```js
/*
trees === [ { a: 1,
    xs: [ { b: 2, cs: [ { d: 3 } ], x: 10 } ],
    ys: [ { g: 12, h: 20 }, { g: 12, h: 21 } ] } ]
*/
```

Notice that `trees.xs.cs` has only one copy of `{d: 3}`.

For more examples, see the test code.

## Details

Flat data like data from a SQL query can have duplicate information especially when JOINs are used. `flatToTrees` will take an `array` of `objects` and combine any keys of the form:

```
<key1>.<key2>...<keyN>.<key>
```
Here the delimiter is the default of `.`. `<key1>` through `<keyN>` will be arrays in the form:

```
<key1>
    <key2>
        ...
            <keyN>
```

Any key's that are of the form:

```
<key>
```

will be used to combine like records. In the above [`example`](#example), the flat data has `a` = `1` for **both** records. This is why they are combined into a **single** hierarchy.

The combination logic is repeated at every level of arrays until the `<key>` is reached where it's simply added to the end of the final array.

In the above [`example`](#example), `xs.cs` implies the following hierarchy:

```js
xs: [
    cs: [
        // objects go here
    ]
]
```
And `xs.cs.d`, is placed in the hierarchy like:

```js
xs: [
    cs: [
        {d: 3}
    ]
]
```
If you're coming to this library from [`treeize`](https://www.npmjs.com/package/treeize), it's **IMPORTANT** to note that there is **NO** naming convention on keys as is true with [`treeize`](https://www.npmjs.com/package/treeize).

Prefixes to keys, i.e. `<key1>` through `<keyN>` will be considered arrays.

Although this library was originally developed with SQL data in mind, which will guarantee that **every column has the same name for each record** and **each record has every column**, i.e. homogenous data, the library works as expected when **neither is true**. The usefulness of such a scenario is debatable, nonetheless, it still works well.
