const uncurryThis = (fn: Function, args: any): Function => {
	return function () {
		return Function.call.apply(fn as any, args);
	};
};

const _hasOwnProperty = (obj: Object, args: any): Function => {
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
		obj = _hasOwnProperty(obj, p) ? (obj as any)[p] : null;
		if (obj === null) {
			break;
		}
	}
	return obj;
};

export const renderTemplate = (
	str: string,
	data: any[],
	options?: {skipUndefined?: boolean; throwOnUndefined?: boolean},
): string => {
	const regex = new RegExp('{{2}(.+?)}{2}', 'g');
	let result: RegExpExecArray | null;
	let formattedString = str;

	while ((result = regex.exec(str)) !== null) {
		const item = result[1].trim();
		if (item !== undefined) {
			const value = prop(data, item);
			if (value !== undefined && value !== null) {
				formattedString = formattedString.replace(result[0], value.toString());
			} else if (options?.throwOnUndefined) {
				const error = new Error('Missing value for ' + result[0]);
				error.name = item;
				error.message = 'E_MISSING_KEY';
				throw error;
			} else if (options?.skipUndefined === true) {
				formattedString = formattedString.replace(result[0], '');
			}
		}
	}
	return formattedString;
};
