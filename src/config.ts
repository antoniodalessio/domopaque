export const config = {
	fetchTimeout: 4000,
	devicePort: '3005',
	serverPort: 3001,
	modelPath: '/model/*.js',
	environments: [
		{
			name: 'soggiorno',
			ips: ['192.168.1.5'],
			color: 'green',
			inside: true,
			floor: 0,
			external_services: {
				actuators: [
					{
						type: 'iftt.webhook',
						name: 'luce_divano',
						on_event: 'divanoon',
						off_event: 'divanooff',
						status_event: '?'
					}
				]
			}			
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