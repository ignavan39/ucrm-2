const uncurryThis = (fn: Function, args: unknown): Function => {
	return function () {
		return Function.call.apply(fn, args);
	};
};

const _hasOwnProperty = (obj: Object, args: unknown): Function => {
	return uncurryThis(obj.hasOwnProperty, args);
};

const isObj = (obj: unknown): boolean => {
	return obj !== null && typeof obj === 'object';
};

const prop = (obj: Object, path: string): Object => {
	if (!isObj(obj) || typeof path !== 'string') {
		return obj;
	}
	const pathArr = path.split('.');
	for (let i = 0; i < pathArr.length; i++) {
		const p = pathArr[i];
		obj = _hasOwnProperty(obj, p) ? obj[p] : null;
		if (obj === null) {
			break;
		}
	}
	return obj;
};

export const renderTemplate = (
	str: string,
	data: unknown[],
	options?: { skipUndefined?: boolean; throwOnUndefined?: boolean },
): string => {
	const regex = new RegExp('{{2}(.+?)}{2}', 'g');
	let result: RegExpExecArray | null;
	let formatString = str;

	while ((result = regex.exec(str)) !== null) {
		const item = result[1].trim();
		if (item !== undefined) {
			const value = prop(data, item);
			if (value !== undefined && value !== null) {
				formatString = formatString.replace(result[0], value.toString());
			} else if (options?.throwOnUndefined) {
				const error = new Error('Missing value for ' + result[0]);
				error.name = item;
				error.message = 'E_MISSING_KEY';
				throw error;
			} else if (options?.skipUndefined === true) {
				formatString = formatString.replace(result[0], '');
			}
		}
	}
	return formatString;
};
