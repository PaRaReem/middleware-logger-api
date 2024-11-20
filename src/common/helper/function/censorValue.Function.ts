/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const censorValue = (data: any, censorKeys: string[], censorType: 'include' | 'match' = 'match', placeholder = 'REDACTED'): any => {
	if (!data) {
		return {};
	}
	const censorObject = (obj: any): any => {
		if (typeof obj !== 'object' || obj === null) {
			return obj;
		}

		if (Array.isArray(obj)) {
			return obj.map(item => censorObject(item));
		}

		const censoredObject: any = { ...obj };

		if (censorType === 'include') {
			const keyArray = Object.keys(censoredObject);
			censorKeys.forEach(keyPart => {
				keyArray.forEach(key => {
					if (key.toLocaleLowerCase().includes(keyPart.toLocaleLowerCase())) {
						if (censoredObject[key]) {
							censoredObject[key] = placeholder;
						} else {
							censoredObject[key] = '';
						}
					} else {
						censoredObject[key] = censorObject(censoredObject[key]);
					}
				});
			});
		} else if (censorType === 'match') {
			censorKeys.forEach(key => {
				if (key in censoredObject) {
					if (censoredObject[key]) {
						censoredObject[key] = placeholder;
					} else {
						censoredObject[key] = '';
					}
					censoredObject[key] = placeholder;
				}
				// Handle nested objects
				else {
					censoredObject[key] = censorObject(censoredObject[key]);
				}
			});
		}

		return censoredObject;
	};

	return censorObject(data);
};

export default censorValue;
