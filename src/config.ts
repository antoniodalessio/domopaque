export const config = {
	fetchTimeout: 4000,
	devicePort: '3005',
	environments: [
		{
			name: 'soggiorno',
			ips: [],
			type: 'master',
			color: 'green',
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
		{
			name: 'corridoio_piano_primo',
			ips: ['192.168.1.11'],
			type: 'slave',
			color: 'yellow'
		},
	]
}