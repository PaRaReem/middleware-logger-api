/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const censorUrlParams = (url: string, censorKeys: string[], censorType: 'include' | 'match' = 'match', placeholder = 'REDACTED'): string => {
	const urlObject = new URL(url);
	const params = urlObject.searchParams;

	const censorParams = () => {
		// Iterate through the parameters and censor based on the specified keys
		censorKeys.forEach(key => {
			if (censorType === 'match' && params.has(key)) {
				params.set(key, placeholder);
			} else if (censorType === 'include') {
				// Check if any key includes the specified part
				for (const [paramKey] of params) {
					if (paramKey.toLowerCase().includes(key.toLowerCase())) {
						params.set(paramKey, placeholder);
					}
				}
			}
		});
	};

	// Censor the parameters
	censorParams();

	// Return the modified URL
	return urlObject.toString();
};

export default censorUrlParams;
