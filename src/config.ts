export const config = {
	environments: [
		{
			name: 'soggiorno',
			ips: '',
			type: 'master',
			color: 'blue',
			sensors: [
				{
					type: 11,
					pin: 4
				}
			]
		},
		{
			name: 'veranda',
			ips: ['192.168.1.10'],
			type: 'slave',
			color: 'purple'
		},
	]
}