export const config = {
	fetchTimeout: 4000,
	devicePort: '3005',
	environments: [
		{
			name: 'soggiorno',
			ips: [],
			type: 'master',
			color: 'green',
			inside: true,
			floor: 0,
			sensors: [
				{
					type: 11,
					pin: 4
				}
			],
			actuators: [
				{
					name: 'main_light',
					type: 'rele'
				}
			]

		},
		{
			name: 'veranda',
			ips: ['192.168.1.10'],
			type: 'slave',
			color: 'purple',
			inside: false,
			floor: 0,
		},
		{
			name: 'corridoio_piano_primo',
			ips: ['192.168.1.11'],
			type: 'slave',
			color: 'yellow',
			inside: true,
			floor: 1,
		},
	]
}