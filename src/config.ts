export const config = {
	fetchTimeout: 4000,
	devicePort: '3005',
	environments: [
		{
			name: 'soggiorno',
			ips: ['192.168.1.5'],
			color: 'green',
			inside: true,
			floor: 0,
		},
		{
			name: 'veranda',
			ips: ['192.168.1.10'],
			color: 'purple',
			inside: false,
			floor: 0,
		},
		{
			name: 'corridoio_piano_primo',
			ips: ['192.168.1.11'],
			color: 'yellow',
			inside: true,
			floor: 1,
		},
	]
}