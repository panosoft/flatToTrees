const util = require ('util');

const R = require('ramda');
const debug = require('debug')('flatToTrees');
const is = require('is_js');

const inspect = obj => util.inspect(obj, {depth:null});
const flatToTrees = (data, options) => {
	options = options || {};
	// set default options
	options = R.merge({
		delimiter: '.',
		removeDuplicateLeaves: false
	}, options);
	const delimiter = options.delimiter;
	const stringCompare = (a, b) => a.localeCompare(b);
	const keys = R.compose(R.sort(stringCompare), R.keys);
	const createTree = (record) => {
		const appendedCollections = {};
		const tree = {};
		R.reduce((acc, path) => {
			const pathParts = R.split(delimiter, path);
			const collectionPathParts = R.dropLast(1, pathParts);
			const key = R.takeLast(1, pathParts)[0];
			// traverse collection path creating arrays along the way
			const collectionPath = R.reduce((acc, pathPart) => {
				acc.path += pathPart;
				const collection = acc.tree[pathPart] || (acc.tree[pathPart] = [(appendedCollections[acc.path] = {})]);
				// update acc's tree for next iteration
				acc.tree = collection[0];
				return acc;
			}, {tree: acc, path: ''}, collectionPathParts).path;
			// add key to collection
			(appendedCollections[collectionPath] || tree)[key] = record[path];
			return acc;
		}, tree, keys(record));
		debug('created tree:', inspect(tree));
		return tree;
	};
	const objectHasArrays = obj => R.find(key => is.array(obj[key]) || (is.object(obj[key]) && objectHasArrays(obj[key])), R.keys(obj));
	const mergeArrays = (tree, treeToMerge) => {
		R.forEach(key => {
			if (is.array(tree[key])) {
				// if the object has arrays and an existing tree exists then recurse
				const existingTree = objectHasArrays(treeToMerge[key][0]) && findExistingTree(treeToMerge[key][0], tree[key]);
				if (existingTree)
					mergeArrays(existingTree, treeToMerge[key][0]);
				// otherwise append
				else if (!options.removeDuplicateLeaves || !R.contains(treeToMerge[key][0], tree[key]))
					tree[key][tree[key].length] = treeToMerge[key][0];
			}
		}, R.keys(treeToMerge));
		return tree;
	};
	const insertRecordIntoTree = (tree, record) => {
		const recordTree = createTree(record);
		debug('tree:', inspect(tree));
		debug('treeToMerge:', inspect(recordTree));
		const mergedTree = mergeArrays(tree, recordTree);
		debug('mergedTree:', inspect(mergedTree));
		return mergedTree;
	};
	// 2 trees are considered to be equivalent if their top-level non-array keys are equal, their array keys are both arrays and their are no extra keys in either
	const equivalentTrees = (tree, tree2) => {
		// use negative logic here to short-circuit on NOT equals
		const eq = (tree, tree2) => !R.find(key => {
			if (is.array(tree[key]))
				return !is.array(tree2[key]);
			else
				return !R.equals(tree[key], tree2[key]);
		}, R.keys(tree));
		return eq(tree, tree2) && eq(tree2, tree);
	};
	const findExistingTree = (tree, trees) => R.find(existingTree => equivalentTrees(tree, existingTree), trees);
	const trees = R.reduce((acc, record) => {
		const tree = createTree(record);
		debug('tree:', inspect(tree));
		// if object does NOT have any arrays then just append it
		if (!objectHasArrays(tree))
			acc[acc.length] = tree;
		// otherwise look for an existing tree to add it to
		else {
			const existingTree = findExistingTree(tree, acc);
			debug('existingTree:', inspect(existingTree));
			existingTree ? insertRecordIntoTree(existingTree, record) : acc[acc.length] = tree;
		}
		return acc;
	}, [], data);
	return trees;
};
module.exports = flatToTrees;
